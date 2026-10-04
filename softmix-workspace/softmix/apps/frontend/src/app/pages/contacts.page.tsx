import { ReactNode } from 'react';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';

import { AppRoute } from '../const';
import { phoneHref } from '../layout/nav';
import { useDocumentTitle } from '../lib/use-document-title';
import { useAppSelector } from '../hooks';
import { getSettings } from '../store/settings-data/selectors';
import { Card } from '../ui/card';
import { Container } from '../ui/layout';
import { PageHeader } from '../ui/page-header';

function ContactCard({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <Card className="flex h-full flex-col p-6">
      <span
        className="grid size-12 place-items-center rounded-xl bg-linear-to-br from-primary-soft to-highlight-soft text-primary [&_svg]:size-6"
        aria-hidden="true"
      >
        {icon}
      </span>
      <h2 className="mt-5 text-sm font-medium text-muted-foreground">{title}</h2>
      <div className="mt-1.5 font-semibold leading-snug">{children}</div>
    </Card>
  );
}

function ContactsPage() {
  const settings = useAppSelector(getSettings);

  useDocumentTitle('Контакты');

  return (
    <>
      <PageHeader title="Контакты" breadcrumbs={[{ label: 'Главная', to: AppRoute.Main }, { label: 'Контакты' }]} />
      <Container className="py-10 sm:py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ContactCard icon={<MapPin />} title="Адрес">
            {settings?.address || '—'}
          </ContactCard>
          <ContactCard icon={<Phone />} title="Номер телефона">
            {settings?.phone ? (
              <a href={phoneHref(settings.phone)} className="transition-colors hover:text-primary">
                {settings.phone}
              </a>
            ) : (
              '—'
            )}
          </ContactCard>
          <ContactCard icon={<Mail />} title="Email">
            {settings?.email ? (
              <a href={`mailto:${settings.email}`} className="break-all transition-colors hover:text-primary">
                {settings.email}
              </a>
            ) : (
              '—'
            )}
          </ContactCard>
          <ContactCard icon={<Clock />} title="Время работы">
            с Пн по Пт: с 9:00 до 18:00
            <span className="mt-1 block text-sm font-normal text-muted-foreground">Суббота, Воскресенье — выходные</span>
          </ContactCard>
        </div>
      </Container>
    </>
  );
}

export default ContactsPage;
