import { FormEvent, useEffect, useId, useMemo, useState } from 'react';
import { ProductUpdate } from '@project-lib/shared-types';

import { Product } from '../../types/product';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { buildCategoryOptions } from '../../lib/catalog';
import { getCategories } from '../../store/categories-data/selectors';
import { getCategoriesApi } from '../../store/categories-data/api-actions';
import { createProductApi, updateProductApi } from '../../store/products-data/api-actions';
import { Button } from '../../ui/button';
import { Checkbox, Field, Input, Select, Textarea } from '../../ui/form';

type FormErrors = Partial<Record<'title' | 'description' | 'categoryId' | 'price' | 'pricePrev' | 'discount', string>>;

function SectionTitle({ children }: { children: string }) {
  return <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{children}</h3>;
}

type ProductFormProps = {
  /** Товар для редактирования; без него форма создаёт новый. */
  product?: Product;
  defaultCategoryId?: string | null;
  onDone: () => void;
};

export function ProductForm({ product, defaultCategoryId, onDone }: ProductFormProps) {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(getCategories);
  const id = useId();

  const [title, setTitle] = useState(product?.title ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product?.price ?? 0);
  const [pricePrev, setPricePrev] = useState(product?.pricePrev ?? 0);
  const [discount, setDiscount] = useState(product?.discount ?? 0);
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? defaultCategoryId ?? '');
  const [isHot, setIsHot] = useState(product?.isHot ?? false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  const options = useMemo(() => buildCategoryOptions(categories), [categories]);

  // Форму открывают и со страницы товара, где категории ещё не загружены.
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(getCategoriesApi());
    }
  }, [categories.length, dispatch]);

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!title.trim()) {
      next.title = 'Введите название товара';
    }
    if (!product && !description.trim()) {
      next.description = 'Введите описание';
    }
    if (!categoryId) {
      next.categoryId = 'Выберите категорию';
    }
    if (!price || price <= 0) {
      next.price = 'Цена должна быть больше нуля';
    }
    if (pricePrev < 0) {
      next.pricePrev = 'Цена не может быть отрицательной';
    }
    if (discount < 0 || discount > 100) {
      next.discount = 'От 0 до 100';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!validate()) {
      return;
    }

    if (product) {
      const update: ProductUpdate = { id: product.id };
      if (title.trim() !== product.title) {
        update.title = title.trim();
      }
      if (description !== product.description) {
        update.description = description;
      }
      if (price !== product.price) {
        update.price = price;
      }
      if (pricePrev !== product.pricePrev) {
        update.pricePrev = pricePrev;
      }
      if (categoryId !== product.categoryId) {
        update.categoryId = categoryId;
      }
      if (discount !== product.discount) {
        update.discount = discount;
      }
      if (isHot !== product.isHot) {
        update.isHot = isHot;
      }

      // Ничего не поменяли — просто закрываем.
      if (Object.keys(update).length === 1) {
        onDone();
        return;
      }

      setIsSaving(true);
      const isSaved = await dispatch(updateProductApi(update)).unwrap();
      setIsSaving(false);
      if (isSaved) {
        onDone();
      }
      return;
    }

    setIsSaving(true);
    const isCreated = await dispatch(
      createProductApi({
        title: title.trim(),
        description: description.trim(),
        price,
        pricePrev,
        discount,
        categoryId,
        isHot,
      }),
    ).unwrap();
    setIsSaving(false);
    if (isCreated) {
      onDone();
    }
  };

  const numberHandler = (setter: (value: number) => void) => (evt: { target: { value: string } }) =>
    setter(Number(evt.target.value));

  return (
    <form className="grid gap-6" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-4">
        <SectionTitle>Основное</SectionTitle>
        <Field label="Название" htmlFor={`${id}-title`} error={errors.title} required>
          <Input
            id={`${id}-title`}
            value={title}
            onChange={(evt) => setTitle(evt.target.value)}
            placeholder="Например, Моноблок XG Crystal Desk GT40"
            aria-invalid={Boolean(errors.title) || undefined}
            autoFocus={!product}
          />
        </Field>
        <Field label="Описание" htmlFor={`${id}-description`} error={errors.description} required={!product}>
          <Textarea
            id={`${id}-description`}
            rows={4}
            value={description}
            onChange={(evt) => setDescription(evt.target.value)}
            placeholder="Краткое описание характеристик и особенностей"
            aria-invalid={Boolean(errors.description) || undefined}
          />
        </Field>
        <Field label="Категория" htmlFor={`${id}-category`} error={errors.categoryId} required>
          <Select
            id={`${id}-category`}
            value={categoryId}
            onChange={(evt) => setCategoryId(evt.target.value)}
            aria-invalid={Boolean(errors.categoryId) || undefined}
          >
            <option value="">— Выберите категорию —</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid gap-4">
        <SectionTitle>Цены</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Цена, ₸" htmlFor={`${id}-price`} error={errors.price} required>
            <Input
              id={`${id}-price`}
              type="number"
              inputMode="numeric"
              min={0}
              value={price}
              onChange={numberHandler(setPrice)}
              aria-invalid={Boolean(errors.price) || undefined}
            />
          </Field>
          <Field label="Старая цена, ₸" htmlFor={`${id}-price-prev`} error={errors.pricePrev}>
            <Input
              id={`${id}-price-prev`}
              type="number"
              inputMode="numeric"
              min={0}
              value={pricePrev}
              onChange={numberHandler(setPricePrev)}
              aria-invalid={Boolean(errors.pricePrev) || undefined}
            />
          </Field>
          <Field label="Скидка, %" htmlFor={`${id}-discount`} error={errors.discount}>
            <Input
              id={`${id}-discount`}
              type="number"
              inputMode="numeric"
              min={0}
              max={100}
              value={discount}
              onChange={numberHandler(setDiscount)}
              aria-invalid={Boolean(errors.discount) || undefined}
            />
          </Field>
        </div>
      </div>

      <div className="grid gap-3">
        <SectionTitle>Дополнительно</SectionTitle>
        <Checkbox
          id={`${id}-hot`}
          checked={isHot}
          onChange={(evt) => setIsHot(evt.target.checked)}
          label="Популярный товар — бейдж «Хит» и блок «Хиты продаж» на главной"
        />
      </div>

      <div className="flex flex-col-reverse gap-2 border-t pt-5 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onDone} disabled={isSaving}>
          Отмена
        </Button>
        <Button type="submit" loading={isSaving}>
          {product ? 'Сохранить' : 'Добавить товар'}
        </Button>
      </div>
    </form>
  );
}
