import { screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { apiCategory, category } from '../../../test/fixtures';
import { mockHttp } from '../../../test/mock-http';
import { authState, guestState, makeUser, renderWithProviders } from '../../../test/render';
import { UserRole } from '../../types/user';
import { CategoryTree } from './category-tree';

const categories = [
  category('pc', 'Компьютеры', null, 0),
  category('parts', 'Комплектующие', 'pc', 1),
  category('gpu', 'Видеокарты', 'parts', 2),
  category('office', 'Офисная техника', null, 0),
];

describe('CategoryTree', () => {
  it('показывает корневые категории и раскрывает путь к выбранной', () => {
    renderWithProviders(<CategoryTree categories={categories} currentCategoryId="gpu" />, { preloadedState: guestState });

    expect(screen.getByRole('link', { name: 'Все товары' })).toHaveAttribute('href', '/shop');
    expect(screen.getByRole('link', { name: 'Компьютеры' })).toHaveAttribute('href', '/shop?categoryId=pc');
    expect(screen.getByRole('link', { name: 'Комплектующие' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Видеокарты' })).toHaveAttribute('aria-current', 'page');
  });

  it('ветки сворачиваются и разворачиваются', async () => {
    const { user } = renderWithProviders(<CategoryTree categories={categories} currentCategoryId={null} />, {
      preloadedState: guestState,
    });

    expect(screen.queryByRole('link', { name: 'Комплектующие' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Развернуть «Компьютеры»' }));
    expect(screen.getByRole('link', { name: 'Комплектующие' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Свернуть «Компьютеры»' }));
    expect(screen.queryByRole('link', { name: 'Комплектующие' })).not.toBeInTheDocument();
  });

  it('покупатель не видит управления категориями', () => {
    renderWithProviders(<CategoryTree categories={categories} currentCategoryId={null} />, { preloadedState: guestState });

    expect(screen.queryByRole('button', { name: 'Добавить категорию' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Действия с категорией/ })).not.toBeInTheDocument();
  });

  it('сотрудник добавляет подкатегорию на уровень ниже родителя', async () => {
    const { calls } = mockHttp([{ method: 'post', url: 'categories', reply: apiCategory('net', 'Сетевое', 'pc', 1) }]);
    const { user } = renderWithProviders(<CategoryTree categories={categories} currentCategoryId={null} />, {
      preloadedState: authState(makeUser(UserRole.Manager)),
    });

    await user.click(screen.getByRole('button', { name: 'Действия с категорией «Компьютеры»' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Добавить подкатегорию' }));

    const dialog = await screen.findByRole('dialog', { name: 'Новая подкатегория' });
    await user.type(within(dialog).getByLabelText('Название'), 'Сетевое');
    await user.click(within(dialog).getByRole('button', { name: 'Добавить' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(calls.find((call) => call.method === 'post')?.data).toEqual({ title: 'Сетевое', ownerId: 'pc', position: 1 });
  });

  it('пустое название не отправляется', async () => {
    const { calls } = mockHttp([]);
    const { user } = renderWithProviders(<CategoryTree categories={categories} currentCategoryId={null} />, {
      preloadedState: authState(makeUser(UserRole.Admin)),
    });

    await user.click(screen.getByRole('button', { name: 'Добавить категорию' }));
    const dialog = await screen.findByRole('dialog', { name: 'Новая категория' });
    await user.click(within(dialog).getByRole('button', { name: 'Добавить' }));

    expect(within(dialog).getByText('Введите название категории')).toBeInTheDocument();
    expect(calls).toHaveLength(0);
  });

  it('удаление открытой категории возвращает во весь каталог', async () => {
    mockHttp([{ method: 'delete', url: 'categories/gpu', status: 204, reply: '' }]);
    const { user } = renderWithProviders(<CategoryTree categories={categories} currentCategoryId="gpu" />, {
      route: '/shop?categoryId=gpu',
      preloadedState: authState(makeUser(UserRole.Admin)),
    });

    await user.click(screen.getByRole('button', { name: 'Действия с категорией «Видеокарты»' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Удалить' }));
    const dialog = await screen.findByRole('dialog', { name: 'Удалить категорию?' });
    await user.click(within(dialog).getByRole('button', { name: 'Удалить' }));

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent(/^\/shop$/));
  });
});
