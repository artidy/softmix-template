import { FormEvent, useId, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router';
import { LogIn } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '../hooks';
import { AppRoute } from '../const';
import { useDocumentTitle } from '../lib/use-document-title';
import { getIsAuth, getIsUnknown } from '../store/user-data/selectors';
import { login } from '../store/user-data/api-actions';
import { AuthLayout } from '../components/auth/auth-layout';
import { PageLoader } from '../ui/feedback';
import { Button } from '../ui/button';
import { Field, Input, PasswordInput } from '../ui/form';

function LoginPage() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isAuth = useAppSelector(getIsAuth);
  const isUnknown = useAppSelector(getIsUnknown);
  const id = useId();
  const [userLogin, setUserLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useDocumentTitle('Вход');

  // Пока проверяем сохранённый вход, не показываем форму — иначе она мелькнёт перед переходом.
  if (isUnknown) {
    return <PageLoader />;
  }

  if (isAuth) {
    // Например, оформление заказа отправляет сюда и ждёт возврата после входа.
    const from = (location.state as { from?: string } | null)?.from;
    return <Navigate to={from ?? AppRoute.Main} replace />;
  }

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setIsSubmitting(true);
    await dispatch(login({ login: userLogin.trim(), password }));
    setIsSubmitting(false);
  };

  return (
    <AuthLayout
      icon={<LogIn />}
      title="Вход в аккаунт"
      description="Войдите в аккаунт, чтобы получить доступ к закрытой части сайта."
      footer={
        <>
          Ещё нет аккаунта?{' '}
          <Link to={AppRoute.Register} className="font-medium text-primary hover:underline">
            Зарегистрироваться
          </Link>
        </>
      }
    >
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <Field label="Логин или email" htmlFor={`${id}-login`}>
          <Input
            id={`${id}-login`}
            name="login"
            value={userLogin}
            onChange={(evt) => setUserLogin(evt.target.value)}
            autoComplete="username"
            required
            autoFocus
          />
        </Field>
        <Field label="Пароль" htmlFor={`${id}-password`}>
          <PasswordInput
            id={`${id}-password`}
            name="password"
            value={password}
            onChange={(evt) => setPassword(evt.target.value)}
            autoComplete="current-password"
            required
          />
        </Field>
        <Button type="submit" size="lg" className="mt-2 w-full" loading={isSubmitting}>
          Войти
        </Button>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;
