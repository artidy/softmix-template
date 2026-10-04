import {
  AppWindow,
  BadgePercent,
  Check,
  ClipboardCheck,
  Code2,
  Layers,
  LucideIcon,
  Monitor,
  PenTool,
  Target,
  TrendingUp,
} from 'lucide-react';

import { AppRoute } from '../const';
import { useDocumentTitle } from '../lib/use-document-title';
import { Card } from '../ui/card';
import { Container, SectionHeading } from '../ui/layout';
import { PageHeader } from '../ui/page-header';

const DIRECTIONS: { Icon: LucideIcon; text: string }[] = [
  {
    Icon: AppWindow,
    text: 'Поставка лицензионного программного обеспечения из любой точки планеты к Вам в офис в кратчайшие сроки и по демократичным ценам.',
  },
  {
    Icon: Monitor,
    text: 'Поставка аппаратного обеспечения от ведущих брендовых компаний мира — HP, Lenovo, Dell, Fujitsu, Xerox.',
  },
  { Icon: Code2, text: 'Разработка и обслуживание программных продуктов на базе платформы 1С:Предприятие.' },
  {
    Icon: ClipboardCheck,
    text: 'Консалтинг в области управления программными активами организации (Software Asset Management).',
  },
  { Icon: PenTool, text: 'Проектирование на базе продуктов Autodesk.' },
];

const SECTORS: { title: string; text: string }[] = [
  {
    title: 'Государственный сектор',
    text: 'Предоставление наиболее актуальной информации в разрезе стоимости, технических характеристик и правил приобретения/лицензирования.',
  },
  {
    title: 'Образовательные учреждения',
    text: 'Обеспечение образовательных учреждений необходимыми программными продуктами с предоставлением скидок от 30 до 70 % в зависимости от продукта. Консалтинг в области лицензирования программного обеспечения, распространяемого на безвозмездной основе.',
  },
  {
    title: 'Национальные корпорации',
    text: 'Предоставление всех необходимых документов при поставке и оказании услуг: лицензий, сертификатов и пр.',
  },
  {
    title: 'Малый и средний бизнес',
    text: 'Оказание технической поддержки малого и среднего бизнеса. Помощь в организации IT-инфраструктуры. IT-аутсорсинг.',
  },
];

const SERVICES = [
  'консультации на этапе подбора программного продукта и его демонстрация;',
  'поставка программного обеспечения;',
  'внедрение программного обеспечения;',
  'поставка и внедрение аппаратного обеспечения;',
  'сопровождение и обновление программного обеспечения;',
  'информационно-технологическое сопровождение;',
  'обучение пользователей и ИТ-специалистов.',
];

const NOTES = [
  'Наша компания также занимается разработкой собственных программных продуктов на платформе «1С:Предприятие 8».',
  'В нашей компании работают сертифицированные специалисты, которые постоянно совершенствуют свои знания и навыки. Они помогут качественно и оперативно решить задачи по автоматизации управления и учета на вашем предприятии.',
  'Наша компания опирается в своей работе на знание и повседневное применение стандартов качества, проектных методов в управлении, процессного подхода в организации нашей деятельности.',
];

const ADVANTAGES: { Icon: LucideIcon; text: string }[] = [
  {
    Icon: TrendingUp,
    text: 'Постоянное совершенствование методик работы, применение передовых технологий, отбор и обучение персонала, стремление находиться на пике технологического прогресса позволяет нам внедрять нашим клиентам лучшие решения в сфере предлагаемых нами услуг.',
  },
  { Icon: Target, text: 'Индивидуальный и комплексный подход в решении задач клиента.' },
  { Icon: Layers, text: 'Широкий спектр предлагаемых решений, основанный на возможностях программных продуктов.' },
  {
    Icon: BadgePercent,
    text: 'Гибкая система ценообразования и индивидуальный подход при формировании стоимости наших услуг.',
  },
];

function IconBox({ Icon }: { Icon: LucideIcon }) {
  return (
    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-linear-to-br from-primary-soft to-highlight-soft text-primary">
      <Icon className="size-5" aria-hidden="true" />
    </span>
  );
}

function AboutPage() {
  useDocumentTitle('О компании');

  return (
    <>
      <PageHeader
        title="О компании"
        breadcrumbs={[{ label: 'Главная', to: AppRoute.Main }, { label: 'О компании' }]}
      />

      <Container className="py-10 sm:py-14">
        <p className="max-w-4xl text-xl leading-relaxed sm:text-2xl">
          Товарищество с ограниченной ответственностью <span className="font-semibold text-primary">«Soft Mix»</span>{' '}
          образовано 9 октября 2013 года командой профессионалов в области вычислительной техники, программного
          обеспечения и проектирования.
        </p>
      </Container>

      <section className="pb-12 sm:pb-16">
        <Container>
          <SectionHeading title="Основные направления деятельности" />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DIRECTIONS.map(({ Icon, text }) => (
              <li key={text}>
                <Card className="flex h-full gap-4 p-5">
                  <IconBox Icon={Icon} />
                  <p className="text-sm leading-relaxed">{text}</p>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-y bg-secondary/40 py-12 sm:py-16">
        <Container>
          <SectionHeading title="Основные секторы" />
          <ol className="grid gap-4 md:grid-cols-2">
            {SECTORS.map((sector, index) => (
              <li key={sector.title}>
                <Card className="flex h-full gap-4 p-5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold">{sector.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{sector.text}</p>
                  </div>
                </Card>
              </li>
            ))}
          </ol>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <Card className="p-6">
              <h3 className="font-semibold">Мы предоставляем полный спектр услуг по автоматизации управления и учета на предприятиях:</h3>
              <ul className="mt-4 grid gap-2.5">
                {SERVICES.map((service) => (
                  <li key={service} className="flex gap-3 text-sm leading-relaxed">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                    {service}
                  </li>
                ))}
              </ul>
            </Card>
            <div className="grid content-start gap-4">
              {NOTES.map((note) => (
                <p key={note} className="border-l-2 border-primary/40 pl-4 text-sm leading-relaxed text-muted-foreground">
                  {note}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <SectionHeading title="Наши преимущества" />
          <ul className="grid gap-4 md:grid-cols-2">
            {ADVANTAGES.map(({ Icon, text }) => (
              <li key={text}>
                <Card className="flex h-full gap-4 p-5">
                  <IconBox Icon={Icon} />
                  <p className="text-sm leading-relaxed">{text}</p>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}

export default AboutPage;
