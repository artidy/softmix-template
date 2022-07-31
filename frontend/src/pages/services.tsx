import {useEffect} from "react";

import BreadCrumbs from "../components/bread-crumbs";
import {AppRoutes} from "../const";
import {useAppDispatch, useAppSelector} from "../hooks/store";
import {fetchServicesAction} from "../store/api-actions";
import ServiceElement from "../components/service-element";
import {observer} from "../hooks/lozad";

const BREAD_CRUMBS = [
  {
    title: 'Услуги',
    link: AppRoutes.Services
  }
];

const Services = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const {services} = useAppSelector(({SERVICES}) => SERVICES);

  useEffect(() => {
    dispatch(fetchServicesAction());
  }, [dispatch]);

  const content = services.map((service) => <ServiceElement key={service.id} service={service} />);

  observer.observe();

  return (
    <>
      <BreadCrumbs elements={BREAD_CRUMBS} />
      <article className="section">
        <div className="container">
          <div className="row items">
            <div className="col-12">
              <div className="section-heading heading-center">
                <div className="section-subheading">Вот что мы предлагаем</div>
                <h1>Наши услуги</h1>
              </div>
            </div>
            {content}
          </div>
        </div>
      </article>
    </>
  )
}

export default Services;
