import AdvantageItem from "./advantage-item";

const Advantages = (): JSX.Element => {
  return (
    <section className="section">
      <div className="container">
        <div className="row items">
          <AdvantageItem materialIcon="local_shipping" title="Бесплатная доставка" description="Для всех заказов суммой больше 30000 тг." />
          <AdvantageItem materialIcon="history" title="Возврат в течении 90 дней" description="Если вам не понравился товар вы можете его вернуть в течении 90 дней." />
          <AdvantageItem materialIcon="payment" title="Безопасные платежи" description="100% безопасные платежи" />
          <AdvantageItem materialIcon="support_agent" title="24/7 поддержка" description="Круглосуточная поддержка" />
        </div>
      </div>
    </section>
  )
}

export default Advantages;
