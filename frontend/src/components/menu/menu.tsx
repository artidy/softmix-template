import MenuItemElement from "./menu-item";
import MenuItem from "../../types/menu-item";

type MenuProps = {
  navClass: string;
  listClass: string;
  elements: MenuItem[];
}

const Menu = ({navClass, listClass, elements}: MenuProps): JSX.Element => {
  const menuContent = elements.map((menuItem) => <MenuItemElement {...menuItem}/>);

  return (
    <nav className={navClass}>
      <ul className={listClass}>
        {menuContent}
      </ul>
    </nav>
  )
}

export default Menu;
