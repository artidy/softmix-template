import Service from "../types/service";
import ServiceApi from "../types/service-api";

const ServiceAdapter = (service: ServiceApi): Service => {
  return {...service};
}

const ServicesAdapter = (services: ServiceApi[]): Service[] => {
  return services.map((service) => ServiceAdapter(service));
}

export {ServiceAdapter, ServicesAdapter}
