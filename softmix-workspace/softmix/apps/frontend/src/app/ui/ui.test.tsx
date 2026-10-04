import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { FadeImage } from './fade-image';
import { Pagination } from './pagination';
import { QuantityStepper } from './quantity-stepper';
import { PasswordInput } from './form';

describe('QuantityStepper', () => {
  it('меняет количество кнопками «−» и «+»', async () => {
    const onChange = vi.fn();
    render(<QuantityStepper value={2} onChange={onChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'Увеличить количество' }));
    await userEvent.click(screen.getByRole('button', { name: 'Уменьшить количество' }));

    expect(onChange).toHaveBeenNthCalledWith(1, 3);
    expect(onChange).toHaveBeenNthCalledWith(2, 1);
  });

  it('не даёт уйти ниже минимума и выше максимума', () => {
    const { rerender } = render(<QuantityStepper value={1} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Уменьшить количество' })).toBeDisabled();

    rerender(<QuantityStepper value={5} max={5} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Увеличить количество' })).toBeDisabled();
  });
});

describe('Pagination', () => {
  const renderAt = (url: string, page: number, totalPages: number) =>
    render(
      <MemoryRouter initialEntries={[url]}>
        <Pagination page={page} totalPages={totalPages} />
      </MemoryRouter>,
    );

  it('сохраняет фильтры в ссылках и убирает устаревший limit', () => {
    renderAt('/shop?categoryId=cat&sortBy=price_asc&page=5&limit=21', 5, 20);

    const next = screen.getByRole('link', { name: 'Следующая страница' });
    expect(next).toHaveAttribute('href', '/shop?categoryId=cat&sortBy=price_asc&page=6');

    // Первая страница — без параметра page.
    expect(screen.getByRole('link', { name: '1' })).toHaveAttribute('href', '/shop?categoryId=cat&sortBy=price_asc');
    expect(screen.getByRole('link', { name: '5' })).toHaveAttribute('aria-current', 'page');
  });

  it('сокращает длинный список многоточиями', () => {
    renderAt('/shop?page=10', 10, 40);

    const pages = screen.getAllByRole('listitem').map((item) => item.textContent);
    expect(pages).toEqual(['', '1', '…', '9', '10', '11', '…', '40', '']);
  });

  it('на первой странице «назад» неактивна', () => {
    renderAt('/shop', 1, 3);
    expect(screen.queryByRole('link', { name: 'Предыдущая страница' })).not.toBeInTheDocument();
  });

  it('одну страницу не показывает', () => {
    const { container } = renderAt('/shop', 1, 1);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('FadeImage', () => {
  it('проявляется после загрузки', () => {
    render(<FadeImage src="/a.jpg" alt="Товар" />);
    const image = screen.getByAltText('Товар');
    expect(image).toHaveClass('opacity-0');

    fireEvent.load(image);
    expect(image).toHaveClass('opacity-100');
  });

  it('при битой ссылке переключается на запасную картинку', () => {
    render(<FadeImage src="/broken.jpg" fallbackSrc="/no-photo.svg" alt="Товар" />);
    const image = screen.getByAltText('Товар');

    fireEvent.error(image);
    expect(image).toHaveAttribute('src', '/no-photo.svg');
  });
});

describe('PasswordInput', () => {
  it('показывает и скрывает пароль', async () => {
    render(<PasswordInput aria-label="Пароль" defaultValue="secret" />);
    const input = screen.getByLabelText('Пароль');
    expect(input).toHaveAttribute('type', 'password');

    await userEvent.click(screen.getByRole('button', { name: 'Показать пароль' }));
    expect(input).toHaveAttribute('type', 'text');

    await userEvent.click(screen.getByRole('button', { name: 'Скрыть пароль' }));
    expect(input).toHaveAttribute('type', 'password');
  });
});
