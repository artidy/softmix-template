import { FormEvent, ReactNode, useId, useState } from 'react';

import { Button } from '../../ui/button';
import { Field, Input } from '../../ui/form';

type CategoryFormProps = {
  initialTitle?: string;
  hint?: ReactNode;
  submitLabel: string;
  /** Возвращает true, если сохранение прошло успешно — тогда окно закрывается. */
  onSubmit: (title: string) => Promise<boolean>;
  onCancel: () => void;
};

export function CategoryForm({ initialTitle = '', hint, submitLabel, onSubmit, onCancel }: CategoryFormProps) {
  const id = useId();
  const [title, setTitle] = useState(initialTitle);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const value = title.trim();
    if (!value) {
      setError('Введите название категории');
      return;
    }
    setError('');

    if (value === initialTitle) {
      onCancel();
      return;
    }

    setIsSaving(true);
    const isSaved = await onSubmit(value);
    setIsSaving(false);
    if (isSaved) {
      onCancel();
    }
  };

  return (
    <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
      <Field label="Название" htmlFor={`${id}-title`} hint={hint} error={error}>
        <Input
          id={`${id}-title`}
          value={title}
          onChange={(evt) => setTitle(evt.target.value)}
          placeholder="Например, Видеокарты"
          aria-invalid={Boolean(error) || undefined}
          autoFocus
        />
      </Field>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          Отмена
        </Button>
        <Button type="submit" loading={isSaving}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
