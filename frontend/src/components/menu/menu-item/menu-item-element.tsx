import {Link} from 'react-router-dom';

import MenuItem from "../../../types/menu-item";

const MenuItemElement = ({title, dataTitle, className, link}: MenuItem): JSX.Element => {
  return (
    <li>
      <Link className={className} to={link} data-title={dataTitle}>
        <span>{title}</span>
      </Link>
    </li>
  )
}

export default MenuItemElement;
