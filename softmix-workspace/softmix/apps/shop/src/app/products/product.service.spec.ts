import { FindOperator, Repository } from 'typeorm';

import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';
import ProductQuery from './queries/product.query';

type FindArgs = {
  where: Record<string, unknown>;
  take: number;
  skip: number;
  order: Record<string, 'ASC' | 'DESC'>;
  relations: string[];
};

function setup() {
  const repository = {
    findAndCount: jest.fn().mockResolvedValue([[{ id: 'p1' }], 1]),
    findOne: jest.fn(),
    create: jest.fn((dto) => dto),
    save: jest.fn(async (entity) => ({ id: 'new', ...entity })),
    delete: jest.fn(),
  };
  const service = new ProductService(repository as unknown as Repository<ProductEntity>);
  const lastArgs = () => repository.findAndCount.mock.calls.at(-1)?.[0] as FindArgs;
  return { service, repository, lastArgs };
}

// Параметры приходят из строки запроса, поэтому в тестах — строки, как в жизни.
const query = (params: Record<string, unknown>) => params as unknown as ProductQuery;

describe('ProductService.findAll', () => {
  it('по умолчанию — первая страница по 20 товаров, старые сначала, с категорией', async () => {
    const { service, lastArgs } = setup();

    await expect(service.findAll(query({}))).resolves.toEqual({ products: [{ id: 'p1' }], total: 1 });

    expect(lastArgs()).toEqual({
      where: {},
      take: 20,
      skip: 0,
      relations: ['category'],
      order: { createdAt: 'ASC' },
    });
  });

  it('считает смещение для страницы', async () => {
    const { service, lastArgs } = setup();
    await service.findAll(query({ page: '3', limit: '21' }));
    expect(lastArgs()).toMatchObject({ take: 21, skip: 42 });
  });

  it.each([
    ['true', true],
    ['false', false],
  ])('фильтр хитов isHot=%s', async (value, expected) => {
    const { service, lastArgs } = setup();
    await service.findAll(query({ isHot: value }));
    expect(lastArgs().where.isHot).toBe(expected);
  });

  it('без isHot не фильтрует по хитам', async () => {
    const { service, lastArgs } = setup();
    await service.findAll(query({ is_hot: 'true' }));
    expect(lastArgs().where).not.toHaveProperty('isHot');
  });

  it('ищет по названию без учёта регистра', async () => {
    const { service, lastArgs } = setup();
    await service.findAll(query({ search: '  Монитор ' }));

    const title = lastArgs().where.title as FindOperator<string>;
    expect(title).toBeInstanceOf(FindOperator);
    expect(title.type).toBe('ilike');
    expect(title.value).toBe('%Монитор%');
  });

  it('экранирует спецсимволы LIKE — «%» и «_» ищутся как обычные символы', async () => {
    const { service, lastArgs } = setup();
    await service.findAll(query({ search: '50%_off\\' }));

    expect((lastArgs().where.title as FindOperator<string>).value).toBe('%50\\%\\_off\\\\%');
  });

  it('пустой поиск игнорирует', async () => {
    const { service, lastArgs } = setup();
    await service.findAll(query({ search: '   ' }));
    expect(lastArgs().where).not.toHaveProperty('title');
  });

  it('одна категория — простое сравнение', async () => {
    const { service, lastArgs } = setup();
    await service.findAll(query({ categoryId: 'cat-1' }));
    expect(lastArgs().where.categoryId).toBe('cat-1');
  });

  it('несколько категорий объединяет без повторов', async () => {
    const { service, lastArgs } = setup();
    await service.findAll(query({ categoryIds: ['a', 'b', 'a'], categoryId: 'c' }));

    const categoryId = lastArgs().where.categoryId as FindOperator<string[]>;
    expect(categoryId.type).toBe('in');
    expect(categoryId.value).toEqual(['a', 'b', 'c']);
  });

  it('одиночный categoryIds из строки запроса — тоже фильтр', async () => {
    const { service, lastArgs } = setup();
    await service.findAll(query({ categoryIds: 'only' }));
    expect(lastArgs().where.categoryId).toBe('only');
  });

  it.each([
    ['newest', { createdAt: 'DESC' }],
    ['oldest', { createdAt: 'ASC' }],
    ['price_asc', { price: 'ASC' }],
    ['price_desc', { price: 'DESC' }],
    ['title_asc', { title: 'ASC' }],
    ['discount', { discount: 'DESC' }],
    ['unknown', { createdAt: 'ASC' }],
  ])('сортировка %s', async (sortBy, order) => {
    const { service, lastArgs } = setup();
    await service.findAll(query({ sortBy }));
    expect(lastArgs().order).toEqual(order);
  });
});

describe('ProductService — изменения', () => {
  it('создаёт товар', async () => {
    const { service, repository } = setup();
    const created = await service.create({ title: 'Монитор', price: 1000 } as never);
    expect(repository.save).toHaveBeenCalledWith({ title: 'Монитор', price: 1000 });
    expect(created).toMatchObject({ id: 'new', title: 'Монитор' });
  });

  it('обновление сохраняет старые поля и меняет только переданные', async () => {
    const { service, repository } = setup();
    repository.findOne.mockResolvedValue({ id: 'p1', title: 'Старое', price: 1000 });

    await service.update('p1', { price: 1500 } as never);

    expect(repository.save).toHaveBeenCalledWith({ id: 'p1', title: 'Старое', price: 1500 });
  });

  it('товар запрашивается вместе с категорией', async () => {
    const { service, repository } = setup();
    await service.findById('p1');
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'p1' }, relations: ['category'] });
  });
});
