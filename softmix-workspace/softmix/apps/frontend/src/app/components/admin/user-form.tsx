import { FormEvent, useId, useState } from 'react';

import { useAppDispatch } from '../../hooks';
import { addUserApi, updateUserApi } from '../../store/user-data/api-actions';
import { USER_ROLES } from '../../const';
import { cn } from '../../lib/cn';
import { UpdateUser, User, UserRole } from '../../types/user';
import { isValidEmail } from '../../utils/format';
import { Button } from '../../ui/button';
import { Field, Input, PasswordInput } from '../../ui/form';

type FormErrors = Partial<Record<'name' | 'login' | 'email' | 'password', string>>;

type UserFormProps = {
  /** Пользователь для редактирования; без него форма создаёт нового. */
  user: User | null;
  onCancel: () => void;
};

export function UserForm({ user, onCancel }: UserFormProps) {
  const dispatch = useAppDispatch();
  const id = useId();
  const isCreate = !user;
  const [name, setName] = useState(user?.name ?? '');
  const [login, setLogin] = useState(user?.login ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(user?.role ?? UserRole.User);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (name.trim().length < 2) {
      next.name = 'Имя должно содержать минимум 2 символа';
    }
    if (isCreate) {
      if (login.trim().length < 3) {
        next.login = 'Логин минимум 3 символа';
      }
      if (password.length < 6) {
        next.password = 'Пароль минимум 6 символов';
      }
    } else if (password && password.length < 6) {
      next.password = 'Пароль минимум 6 символов';
    }
    if (email.trim() && !isValidEmail(email.trim())) {
      next.email = 'Некорректный email';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!validate()) {
      return;
    }

    // Окно закрывается само: после успеха thunk'и сбрасывают режим создания или редактирования.
    if (isCreate) {
      setIsSaving(true);
      await dispatch(
        addUserApi({
          name: name.trim(),
          login: login.trim(),
          email: email.trim() || undefined,
          password,
          role,
        }),
      );
      setIsSaving(false);
      return;
    }

    const update: UpdateUser = { id: user.id };
    if (name.trim() !== user.name) {
      update.name = name.trim();
    }
    if (password) {
      update.password = password;
    }
    if (role !== user.role) {
      update.role = role;
    }

    if (Object.keys(update).length === 1) {
      onCancel();
      return;
    }

    setIsSaving(true);
    await dispatch(updateUserApi(update));
    setIsSaving(false);
  };

  const invalid = (key: keyof FormErrors) => Boolean(errors[key]) || undefined;

  return (
    <form className="grid gap-6" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Имя" htmlFor={`${id}-name`} error={errors.name} required>
          <Input
            id={`${id}-name`}
            value={name}
            onChange={(evt) => setName(evt.target.value)}
            autoComplete="off"
            aria-invalid={invalid('name')}
            autoFocus={isCreate}
          />
        </Field>
        <Field label="Логин" htmlFor={`${id}-login`} error={errors.login} required={isCreate}>
          <Input
            id={`${id}-login`}
            value={login}
            onChange={(evt) => setLogin(evt.target.value)}
            readOnly={!isCreate}
            className={cn(!isCreate && 'bg-muted text-muted-foreground')}
            autoComplete="off"
            aria-invalid={invalid('login')}
          />
        </Field>
        <Field label="Email" htmlFor={`${id}-email`} error={errors.email}>
          <Input
            id={`${id}-email`}
            type="email"
            value={email}
            onChange={(evt) => setEmail(evt.target.value)}
            readOnly={!isCreate}
            className={cn(!isCreate && 'bg-muted text-muted-foreground')}
            autoComplete="off"
            aria-invalid={invalid('email')}
          />
        </Field>
        <Field
          label="Пароль"
          htmlFor={`${id}-password`}
          error={errors.password}
          hint={isCreate ? 'Минимум 6 символов' : 'Оставьте пустым, чтобы не менять'}
          required={isCreate}
        >
          <PasswordInput
            id={`${id}-password`}
            value={password}
            onChange={(evt) => setPassword(evt.target.value)}
            autoComplete="new-password"
            aria-invalid={invalid('password')}
          />
        </Field>
      </div>

      <fieldset className="grid gap-2">
        <legend className="mb-2 text-sm font-medium">Роль</legend>
        <div className="inline-flex flex-wrap gap-2">
          {USER_ROLES.map((item) => {
            const isActive = String(item.role) === String(role);
            return (
              <label
                key={item.role}
                className={cn(
                  'cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
                  isActive ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-accent',
                )}
              >
                <input
                  type="radio"
                  name={`${id}-role`}
                  value={item.role}
                  checked={isActive}
                  onChange={(evt) => setRole(evt.target.value as UserRole)}
                  className="sr-only"
                />
                {item.title}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-col-reverse gap-2 border-t pt-5 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          Отмена
        </Button>
        <Button type="submit" loading={isSaving}>
          {isCreate ? 'Создать' : 'Сохранить'}
        </Button>
      </div>
    </form>
  );
}
