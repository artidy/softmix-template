type MenuItemProps = {
  hrefLink: string;
  title: string;
}

const MenuItem = ({hrefLink, title}: MenuItemProps): JSX.Element => {
  return (
    <li>
      <a href={hrefLink} data-title={title}>
        <span>{title}</span>
      </a>
    </li>
  )
}

export default MenuItem;
