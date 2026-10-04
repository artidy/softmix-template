import { Link } from 'react-router';
import { ArrowRight, Phone } from 'lucide-react';

import { AppRoute } from '../../const';
import { useAppSelector } from '../../hooks';
import { getSettings } from '../../store/settings-data/selectors';
import { phoneHref } from '../../layout/nav';
import { Container } from '../../ui/layout';

export function ContactCta() {
  const settings = useAppSelector(getSettings);

  return (
    <section className="py-14 sm:py-20">
      <Container>
        {/* Фирменный градиент из цветов логотипа — одинаково читается в обеих темах. */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#0b7a87] via-[#0b6875] to-[#5b2bb8] px-6 py-12 text-white shadow-elevated sm:px-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(to_right,rgb(255_255_255/0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.2)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_at_right,black,transparent_70%)]"
            aria-hidden="true"
          />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="text-3xl font-semibold sm:text-4xl">Нужна консультация?</h2>
              <p className="mt-3 max-w-xl text-lg text-white/80">
                Расскажите о задаче — поможем подобрать оборудование и программное обеспечение.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              {settings?.phone && (
                <a
                  href={phoneHref(settings.phone)}
                  className="inline-flex h-12 items-center gap-2 rounded-lg bg-white px-6 font-medium text-[#0b6875] shadow-sm transition-colors hover:bg-white/90"
                >
                  <Phone className="size-5" aria-hidden="true" />
                  {settings.phone}
                </a>
              )}
              <Link
                to={AppRoute.Contacts}
                className="inline-flex h-12 items-center gap-2 rounded-lg border border-white/30 px-6 font-medium text-white transition-colors hover:bg-white/10"
              >
                Все контакты
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
