const About = (): JSX.Element => {
  return (
    <div className="section">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-heading heading-center">
              <div className="section-subheading">БОЛЬШЕ ИНФОРМАЦИИ</div>
              <h1>О компании</h1>
            </div>
            <div className="content">
              <div className="img-style">
                <img src="assets/img/about-img.jpg" alt="" />
              </div>
              <h2>Товарищество с ограниченной ответственностью «Soft Mix»</h2>
              <p>Образовано 9 октября 2013 года командой профессионалов в области Вычислительной техники,
                программного обеспечения и проектирования.</p>
              <h3>Основные направления деятельности:</h3>
              <ol>
                <li>Поставка лицензионного программного обеспечения из любой точки планеты к
                  Вам в офис в кратчайшие сроки и по демократичным ценам.</li>
                <li>Поставка аппаратного обеспечения от ведущих брендовых компаний мира - HP,
                  Lenovo, Dell, Fujitsu, Xerox.</li>
                <li>Разработка и обслуживание программных продуктов на базе платформы 1С:Предприятие.</li>
                <li>Консалтинг в области управления программными активами организации (Software Asset Management).</li>
                <li>Проектирование на базе продуктов Autodesk.</li>
              </ol>
              <h3>Основные секторы:</h3>
              <ol>
                <li>Государственный сектор. Предоставление наиболее актуальной информации в разрезе стоимости,
                  технических характеристик и правил приобретения/лицензирования.</li>
                <li>Образовательные учреждения. Обеспечение образовательных учреждений необходимыми программными
                  продуктами с предоставлением скидок от 30 до 70 % в зависимости от продукта. Консалтинг в области
                  лицензирования программного обеспечения, распространяемого на безвозмездной основе.</li>
                <li>Национальные корпорации. Предоставление всех необходимых документов при поставке и оказании услуг:
                  лицензий, сертификатов и пр.</li>
                <li>Малый и средний бизнес. Оказание технической поддержки малого и среднего бизнеса. Помощь в
                  организации IT-инфраструктуры. IT-аутсорсинг.</li>
              </ol>
              <h3>Мы предоставляем полный спектр услуг по автоматизации управления и учета на предприятиях:</h3>
              <ul>
                <li>консультации на этапе подбора программного продукта и его демонстрация.</li>
                <li>поставка программного обеспечения.</li>
                <li>внедрение программного обеспечения.</li>
                <li>поставка и внедрение аппаратного обеспечения.</li>
                <li>сопровождение и обновление программного обеспечения.</li>
                <li>информационно-технологическое сопровождение.</li>
                <li>обучение пользователей и ИТ-специалистов.</li>
              </ul>
              <h3>Наша компания также занимается разработкой собственных программных продуктов
                на платформе «1С:Предприятие 8»:</h3>
              <ul>
                <li>В нашей компании работают сертифицированные  специалисты, которые постоянно совершенствуют свои
                  знания и навыки. Они помогут качественно и оперативно решить задачи по автоматизации управления
                  и учета на вашем предприятии.</li>
                <li>Наша компания опирается в своей работе на знание и повседневное применение стандартов качества,
                  проектных методов в управлении, процессного подхода в организации нашей деятельности. </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About;
