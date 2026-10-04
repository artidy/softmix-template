import * as path from 'path';

import { generateFileName, getShortPathFile } from './helpers';

describe('uploader helpers', () => {
  it('файл называется по id товара и типу картинки — новое фото заменяет старое', () => {
    const name = generateFileName({ params: { id: 'product-1' } } as never, { mimetype: 'image/png' } as never);
    expect(name).toBe('product-1.png');
  });

  it('путь к файлу внутри папки assets — его раздаёт сервис по адресу /assets/…', () => {
    expect(getShortPathFile('img/products', 'product-1.png')).toBe(path.join('assets', 'img', 'products', 'product-1.png'));
  });
});
