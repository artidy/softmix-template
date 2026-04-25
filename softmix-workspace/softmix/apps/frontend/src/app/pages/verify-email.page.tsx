import { ReactElement, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { useAppDispatch } from '../hooks';
import { AppRoute } from '../const';
import { resendVerification } from '../store/user-data/api-actions';
import BreadcrumbComponent from '../components/breadcrumb/breadcrumb.component';

const REASON_LABELS: Record<string, string> = {
  NOT_FOUND: 'Ссылка недействительна или устарела.',
  EXPIRED: 'Срок действия ссылки истёк (24 часа).',
  USED: 'Эта ссылка уже была использована ранее.',
};

function VerifyEmailPage(): ReactElement {
  const dispatch = useAppDispatch();
  const [params] = useSearchParams();
  const status = params.get('status');
  const reason = params.get('reason') ?? '';

  const [identifier, setIdentifier] = useState('');

  const handleResend = () => {
    if (identifier.trim()) {
      dispatch(resendVerification(identifier.trim()));
    }
  };

  const isSuccess = status === 'success';

  return (
    <>
      <BreadcrumbComponent
        title={isSuccess ? 'Email подтверждён' : 'Подтверждение email'}
        links={[{ title: 'Главная', href: AppRoute.Main }]}
        pageName={isSuccess ? 'Готово' : 'Ошибка'}
      />
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 text-center">
            {isSuccess ? (
              <>
                <h2>Email подтверждён 🎉</h2>
                <p>Теперь вы можете войти в свой аккаунт.</p>
                <Link to={AppRoute.Login} className="btn btn-primary mt-3">
                  Войти
                </Link>
              </>
            ) : (
              <>
                <h2>Не удалось подтвердить email</h2>
                <p className="text-muted">
                  {REASON_LABELS[reason] || 'Неизвестная ошибка верификации.'}
                </p>
                <p>Запросите новую ссылку:</p>
                <div className="d-flex flex-column gap-2 mx-auto" style={{ maxWidth: 360 }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Логин или email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleResend}
                    disabled={!identifier.trim()}
                  >
                    Отправить ссылку повторно
                  </button>
                  <Link to={AppRoute.Login} className="btn btn-link">
                    Перейти ко входу
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default VerifyEmailPage;
