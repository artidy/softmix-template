import Brand from "../../types/brand";
import CustomersItem from "./customers-item";

const CUSTOMERS: Brand[] = [
  {
    title: 'circle',
    logo: 'assets/img/brands/circle.png'
  },
  {
    title: 'codelab',
    logo: 'assets/img/brands/codelab.png'
  },
  {
    title: 'earth',
    logo: 'assets/img/brands/earth.png'
  },
  {
    title: 'hexa',
    logo: 'assets/img/brands/hexa.png'
  },
  {
    title: 'lightai',
    logo: 'assets/img/brands/lightai.png'
  },
  {
    title: 'nirastate',
    logo: 'assets/img/brands/nirastate.png'
  },
  {
    title: 'treva',
    logo: 'assets/img/brands/treva.png'
  },
  {
    title: 'zootv',
    logo: 'assets/img/brands/zootv.png'
  }
]

const Customers = (): JSX.Element => {
  const content = CUSTOMERS.map((customer) => <CustomersItem key={customer.title} {...customer} />);

  return (
    <section className="section">
      <div className="container">
        <div className="row items">
          <div className="col-12">
            <div className="section-heading heading-center">
              <div className="section-subheading">Лучшие</div>
              <h2>Наши клиенты</h2>
              <p className="section-desc">Наши клиенты изменили отрасли, открыли новые рынки и сделали жизнь
                бессчетного количества людей лучше. Нам выпала честь работать с сотнями компаний, думающих о будущем,
                в том числе со многими ведущими мировыми производителями аппаратного и программного обеспечения,
                а также потребительскими брендами.</p>
            </div>
          </div>
          {content}
        </div>
      </div>
    </section>
  )
}

export default Customers;
