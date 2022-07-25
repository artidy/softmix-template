import BreadCrumbs from "../components/bread-crumbs";
import {AppRoutes} from "../const";
import About from "../components/about";
import AdvantagesNumber from "../components/advantages-number";

const BREAD_CRUMBS = [
  {
    title: 'О компании',
    link: AppRoutes.About
  }
]

const AboutUs = (): JSX.Element => {
  return (
    <>
      <BreadCrumbs elements={BREAD_CRUMBS} />
      <About />
      <AdvantagesNumber />
    </>
  )
}

export default AboutUs;
