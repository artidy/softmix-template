import SocialLinkItem from "./social-link-item";

const SocialLinks = (): JSX.Element => {
  return (
    <ul className="social-links">
      <SocialLinkItem
        title='Facebook'
        link='#'
        viewBox='0 0 320 512'
        linkIcon='assets/img/sprite.svg#facebook-icon'
      />
      <SocialLinkItem
        title='LinkedIn'
        link='#'
        viewBox='0 0 448 512'
        linkIcon='assets/img/sprite.svg#linkedin-icon'
      />
      <SocialLinkItem
        title='Twitter'
        link='#'
        viewBox='0 0 512 512'
        linkIcon='assets/img/sprite.svg#twitter-icon'
      />
      <SocialLinkItem
        title='Instagram'
        link='#'
        viewBox='0 0 448 512'
        linkIcon='assets/img/sprite.svg#instagram-icon'
      />
    </ul>
  )
}

export default SocialLinks;
