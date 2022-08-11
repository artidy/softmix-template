import {Link} from 'react-router-dom';

import {AppRoutes} from '../../const';

type LogoProps = {
  title: string;
  src: string;
}

const Logo = ({title, src}: LogoProps): JSX.Element => {
  return (
    <Link to={AppRoutes.Main} className="logo" title={title}>
      <img src={src} width="273" height="273" alt={title} />
    </Link>
  )
}

export default Logo;
