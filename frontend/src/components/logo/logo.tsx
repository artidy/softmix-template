type LogoProps = {
  title: string;
  src: string;
}

const Logo = ({title, src}: LogoProps): JSX.Element => {
  return (
    <a href="/" className="logo" title={title}>
      <img src={src} width="273" height="273" alt={title} />
    </a>
  )
}

export default Logo;
