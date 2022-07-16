type SocialLinkItemProps = {
  title: string;
  link: string;
  viewBox: string;
  linkIcon: string;
}

const SocialLinkItem = ({title, link, viewBox, linkIcon}: SocialLinkItemProps): JSX.Element => {
  return (
    <li>
      <a href={link} title={title}>
        <svg viewBox={viewBox}>
          <use xlinkHref={linkIcon}></use>
        </svg>
      </a>
    </li>
  )
}

export default SocialLinkItem;
