import AdvantageNumber from "../../types/advantage-number";
import AdvantagesNumberItem from "./advantages-number-item";

const ADVANTAGES: AdvantageNumber[] = [
  {
    position: '01',
    title: 'Профессионализм',
    description: 'Постоянное совершенствование методик работы, применение передовых технологий, отбор и обучение ' +
      'персонала, стремление находиться на пике технологического прогресса позволяет нам внедрять нашим клиентам ' +
      'лучшие решения в сфере предлагаемых нами услуг.'
  },
  {
    position: '02',
    title: 'Индивидуальный подход',
    description: 'Индивидуальный и комплексный подход в решении задач клиента.'
  },
  {
    position: '03',
    title: 'Широкий спектр услуг',
    description: 'Широкий спектр предлагаемых решений, основанный на возможностях программных продуктов.'
  },
  {
    position: '04',
    title: 'Доступные цены',
    description: 'Гибкая система ценообразования и индивидуальный подход при формировании стоимости наших услуг.'
  },
  {
    position: '05',
    title: 'Возврат в течении 90 дней',
    description: 'Если вам не понравился товар вы можете его вернуть в течении 90 дней.'
  },
  {
    position: '06',
    title: 'Бесплатная доставка',
    description: 'Для всех заказов суммой больше 30000 тг.'
  }
]

const AdvantagesNumber = (): JSX.Element => {
  const content = ADVANTAGES.map((advantage) =>
    <AdvantagesNumberItem key={advantage.position} {...advantage} />);

  return (
    <section className="section section-bgc">
      <div className="container">
        <div className="row litems">
          <div className="col-12">
            <div className="section-heading heading-center">
              <div className="section-subheading">Несколько причин</div>
              <h2>Почему стоит выбрать нас</h2>
            </div>
          </div>
          {content}
        </div>
      </div>
    </section>
  )
}

export default AdvantagesNumber;
