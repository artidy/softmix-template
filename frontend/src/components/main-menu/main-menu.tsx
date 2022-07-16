import MenuItem from "../menu-item";

const MainMenu = (): JSX.Element => {
  return (
    <nav className="main-mnu">
      <ul className="main-mnu-list main-mnu-list-min">
        <MenuItem hrefLink={'index.html'} title={'Главная'} />
        <MenuItem hrefLink={'services.html'} title={'О компании'} />
        <MenuItem hrefLink={'ui.html'} title={'Услуги'} />
        <MenuItem hrefLink={'shop.html'} title={'Товары'} />
        <MenuItem hrefLink={'news.html'} title={'Контакты'} />
      </ul>
    </nav>
  )
}

export default MainMenu;
