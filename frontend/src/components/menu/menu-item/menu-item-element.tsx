import MenuItem from "../../../types/menu-item";

const MenuItemElement = ({title, dataTitle, className, link}: MenuItem): JSX.Element => {
  return (
    <li>
      <a href={link} data-title={dataTitle}>
        <span>{title}</span>
      </a>
    </li>
  )
}

export default MenuItemElement;
