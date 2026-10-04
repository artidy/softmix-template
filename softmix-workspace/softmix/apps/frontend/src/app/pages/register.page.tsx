import { FormEvent, useId, useState } from 'react';
import { Link, Navigate } from 'react-router';
import { MailCheck, UserPlus } from 'lucide-react';
import { UserRole } from '@project-lib/shared-types';

import { useAppDispatch, useAppSelector } from '../hooks';
import { AppRoute } from '../const';
import { useDocumentTitle } from '../lib/use-document-title';
import { getIsAuth, getIsUnknown } from '../store/user-data/selectors';
import { register, resendVerification } from '../store/user-data/api-actions';
import { isValidEmail } from '../utils/format';
import { AuthLayout } from '../components/auth/auth-layout';
import { PageLoader } from '../ui/feedback';
import { Button, buttonVariants } from '../ui/button';
import { Field, Input, PasswordInput } from '../ui/form';

type FormErrors = Partial<Record<'name' | 'login' | 'email' | 'password' | 'confirmPassword', string>>;

function RegisterPage() {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(getIsAuth);
  const isUnknown = useAppSelector(getIsUnknown);
  const id = useId();
  const [name, setName] = useState('');
  const [userLogin, setUserLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  useDocumentTitle('Регистрация');

  // Пока проверяем сохранённый вход, не показываем форму — иначе она мелькнёт перед переходом.
  if (isUnknown) {
    return <PageLoader />;
  }

  if (isAuth) {
    return <Navigate to={AppRoute.Main} replace />;
  }

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (name.trim().length < 2) {
      next.name = 'Имя должно содержать минимум 2 символа';
    }
    if (userLogin.trim().length < 3) {
      next.login = 'Логин должен содержать минимум 3 символа';
    }
    if (!isValidEmail(email.trim())) {
      next.email = 'Некорректный email';
    }
    if (password.length < 6) {
      next.password = 'Пароль должен содержать минимум 6 символов';
    }
    if (password !== confirmPassword) {
      next.confirmPassword = 'Пароли не совпадают';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!validate()) {
      return;
    }

    const trimmedEmail = email.trim();
    setIsSubmitting(true);
    const isRegistered = await dispatch(
      register({
        name: name.trim(),
        login: userLogin.trim(),
        email: trimmedEmail,
        password,
        role: UserRole.User,
      }),
    ).unwrap();
    setIsSubmitting(false);

    if (isRegistered) {
      setSubmittedEmail(trimmedEmail);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    await dispatch(resendVerification(submittedEmail));
    setIsResending(false);
  };

  if (submittedEmail) {
    return (
      <AuthLayout
        icon={<MailCheck />}
        tone="success"
        title="Проверьте почту"
        description={
          <>
            Мы отправили письмо с подтверждением на <span className="font-medium text-foreground">{submittedEmail}</span>.
            Перейдите по ссылке из письма, чтобы активировать аккаунт.
          </>
        }
      >
        <p className="text-sm text-muted-foreground">Не пришло письмо? Проверьте папку «Спам».</p>
        <div className="mt-6 grid gap-2">
          <Button variant="outline" onClick={handleResend} loading={isResending}>
            Отправить ссылку повторно
          </Button>
          <Link to={AppRoute.Login} className={buttonVariants({ variant: 'ghost' })}>
            Перейти ко входу
          </Link>
        </div>
      </AuthLayout>
    );
  }

  const invalid = (key: keyof FormErrors) => Boolean(errors[key]) || undefined;

  return (
    <AuthLayout
      icon={<UserPlus />}
      title="Регистрация"
      description="Создайте новый аккаунт, чтобы получить доступ к закрытой части сайта."
      footer={
        <>
          Уже есть аккаунт?{' '}
          <Link to={AppRoute.Login} className="font-medium text-primary hover:underline">
            Войти
          </Link>
        </>
      }
    >
      <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
        <Field label="Имя" htmlFor={`${id}-name`} error={errors.name} required>
          <Input
            id={`${id}-name`}
            value={name}
            onChange={(evt) => setName(evt.target.value)}
            autoComplete="name"
            aria-invalid={invalid('name')}
            autoFocus
          />
        </Field>
        <Field label="Логин" htmlFor={`${id}-login`} error={errors.login} required>
          <Input
            id={`${id}-login`}
            value={userLogin}
            onChange={(evt) => setUserLogin(evt.target.value)}
            autoComplete="username"
            aria-invalid={invalid('login')}
          />
        </Field>
        <Field label="Email" htmlFor={`${id}-email`} error={errors.email} required>
          <Input
            id={`${id}-email`}
            type="email"
            value={email}
            onChange={(evt) => setEmail(evt.target.value)}
            autoComplete="email"
            aria-invalid={invalid('email')}
          />
        </Field>
        <Field label="Пароль" htmlFor={`${id}-password`} error={errors.password} hint="Минимум 6 символов" required>
          <PasswordInput
            id={`${id}-password`}
            value={password}
            onChange={(evt) => setPassword(evt.target.value)}
            autoComplete="new-password"
            aria-invalid={invalid('password')}
          />
        </Field>
        <Field label="Подтвердите пароль" htmlFor={`${id}-confirm`} error={errors.confirmPassword} required>
          <PasswordInput
            id={`${id}-confirm`}
            value={confirmPassword}
            onChange={(evt) => setConfirmPassword(evt.target.value)}
            autoComplete="new-password"
            aria-invalid={invalid('confirmPassword')}
          />
        </Field>
        <Button type="submit" size="lg" className="mt-2 w-full" loading={isSubmitting}>
          Зарегистрироваться
        </Button>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;
