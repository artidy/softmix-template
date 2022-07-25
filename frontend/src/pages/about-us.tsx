import BreadCrumbs from "../components/bread-crumbs";
import {AppRoutes} from "../const";

const BREAD_CRUMBS = [
  {
    title: 'О нас',
    link: AppRoutes.About
  }
]

const AboutUs = (): JSX.Element => {
  return (
    <>
      <BreadCrumbs elements={BREAD_CRUMBS} />
    </>
  )
}

export default AboutUs;
