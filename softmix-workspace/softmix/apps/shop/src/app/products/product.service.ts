import { Injectable, Logger } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, ProductsPaginationApi } from '@project-lib/shared-types';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './product.entity';
import ProductQuery from './queries/product.query';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
  ) {}

  public async findAll(query: ProductQuery): Promise<ProductsPaginationApi> {
    const { isHot, categoryId, categoryIds, sortBy } = query;
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const ids = this.resolveCategoryIds(categoryIds, categoryId);
    const where: Record<string, unknown> = {};
    if (isHot !== undefined) where.isHot = isHot;
    if (ids && ids.length === 1) where.categoryId = ids[0];
    else if (ids && ids.length > 1) where.categoryId = In(ids);

    const [products, total] = await this.repository.findAndCount({
      where,
      take: limit,
      skip,
      relations: ['category'],
      order: this.buildOrder(sortBy),
    });

    return { products, total };
  }

  private buildOrder(sortBy: string | undefined): Record<string, 'ASC' | 'DESC'> {
    switch (sortBy) {
      case 'newest':
        return { createdAt: 'DESC' };
      case 'price_asc':
        return { price: 'ASC' };
      case 'price_desc':
        return { price: 'DESC' };
      case 'title_asc':
        return { title: 'ASC' };
      case 'discount':
        return { discount: 'DESC' };
      case 'oldest':
      default:
        return { createdAt: 'ASC' };
    }
  }

  private resolveCategoryIds(
    categoryIds: string[] | string | undefined,
    categoryId: string | undefined,
  ): string[] | null {
    const collected: string[] = [];

    if (Array.isArray(categoryIds)) {
      collected.push(...categoryIds);
    } else if (typeof categoryIds === 'string' && categoryIds.length > 0) {
      collected.push(categoryIds);
    }

    if (categoryId) {
      collected.push(categoryId);
    }

    const unique = Array.from(new Set(collected.filter(Boolean)));
    return unique.length > 0 ? unique : null;
  }

  public async findById(id: string): Promise<Product> {
    return this.repository.findOne({ where: { id }, relations: ['category']});
  }

  public async create(dto: CreateProductDto): Promise<Product> {
    const element = this.repository.create({...dto});

    return this.repository.save(element);
  }

  public async createMany(dto: CreateProductDto[]): Promise<Product[]> {
    const elements = dto.map((dtoElement) => this.repository.create({...dtoElement}));

    return this.repository.save(elements);
  }

  public async update(id: string, dto: UpdateProductDto): Promise<Product | null> {
    const element = await this.repository.findOne({ where: { id }});

    return this.repository.save({
      ...element,
      ...dto
    });
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
