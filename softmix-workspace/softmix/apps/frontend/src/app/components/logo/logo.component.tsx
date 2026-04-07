import { memo, ReactElement } from 'react';

type LogoComponentProps = {
  className: string;
  href: string;
  src: string;
  alt: string;
}

function LogoComponent({className, href, src, alt}: LogoComponentProps): ReactElement {
  return (
    <div className={className}>
      <a href={href}><img src={src} alt={alt} /></a>
    </div>
  )
}

export default memo(LogoComponent);
