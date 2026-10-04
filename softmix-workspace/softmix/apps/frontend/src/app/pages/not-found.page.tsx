import { Link } from 'react-router';
import { SearchX } from 'lucide-react';

import { AppRoute } from '../const';
import { useDocumentTitle } from '../lib/use-document-title';
import { buttonVariants } from '../ui/button';
import { EmptyState } from '../ui/feedback';
import { Container } from '../ui/layout';

function NotFoundPage() {
  useDocumentTitle('Страница не найдена');

  return (
    <Container className="py-16 sm:py-24">
      <EmptyState
        icon={<SearchX />}
        title="Страница не найдена"
        description="Возможно, ссылка устарела или в адресе опечатка."
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link to={AppRoute.Main} className={buttonVariants()}>
              На главную
            </Link>
            <Link to={AppRoute.Shop} className={buttonVariants({ variant: 'outline' })}>
              Перейти в каталог
            </Link>
          </div>
        }
        className="rounded-2xl border bg-card"
      />
    </Container>
  );
}

export default NotFoundPage;
