import { FormEvent, useId, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { CircleCheck, CircleX } from 'lucide-react';

import { useAppDispatch } from '../hooks';
import { AppRoute } from '../const';
import { useDocumentTitle } from '../lib/use-document-title';
import { resendVerification } from '../store/user-data/api-actions';
import { AuthLayout } from '../components/auth/auth-layout';
import { Button, buttonVariants } from '../ui/button';
import { Field, Input } from '../ui/form';

const REASON_LABELS: Record<string, string> = {
  NOT_FOUND: 'Ссылка недействительна или устарела.',
  EXPIRED: 'Срок действия ссылки истёк (24 часа).',
  USED: 'Эта ссылка уже была использована ранее.',
};

function VerifyEmailPage() {
  const dispatch = useAppDispatch();
  const [params] = useSearchParams();
  const id = useId();
  const isSuccess = params.get('status') === 'success';
  const reason = params.get('reason') ?? '';
  const [identifier, setIdentifier] = useState('');
  const [isSending, setIsSending] = useState(false);

  useDocumentTitle(isSuccess ? 'Email подтверждён' : 'Подтверждение email');

  const handleResend = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!identifier.trim()) {
      return;
    }
    setIsSending(true);
    await dispatch(resendVerification(identifier.trim()));
    setIsSending(false);
  };

  if (isSuccess) {
    return (
      <AuthLayout
        icon={<CircleCheck />}
        tone="success"
        title="Email подтверждён"
        description="Теперь вы можете войти в свой аккаунт."
      >
        <Link to={AppRoute.Login} className={buttonVariants({ size: 'lg', className: 'w-full' })}>
          Войти
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={<CircleX />}
      tone="error"
      title="Не удалось подтвердить email"
      description={REASON_LABELS[reason] || 'Неизвестная ошибка верификации.'}
      footer={
        <Link to={AppRoute.Login} className="font-medium text-primary hover:underline">
          Перейти ко входу
        </Link>
      }
    >
      <form className="grid gap-4" onSubmit={handleResend}>
        <Field label="Запросите новую ссылку" htmlFor={`${id}-identifier`}>
          <Input
            id={`${id}-identifier`}
            placeholder="Логин или email"
            value={identifier}
            onChange={(evt) => setIdentifier(evt.target.value)}
            autoComplete="username"
          />
        </Field>
        <Button type="submit" className="w-full" loading={isSending} disabled={!identifier.trim()}>
          Отправить ссылку повторно
        </Button>
      </form>
    </AuthLayout>
  );
}

export default VerifyEmailPage;
