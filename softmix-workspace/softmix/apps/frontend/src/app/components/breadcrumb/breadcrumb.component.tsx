import { memo, ReactElement } from 'react';

import Link from '../../types/link';

type BreadcrumbComponentProps = {
  title: string;
  pageName: string;
  links: Link[];
}

function BreadcrumbComponent({title, pageName, links}: BreadcrumbComponentProps): ReactElement {
  const linksContent = links.map((link, index) =>
    <li key={index}><a href={link.href}>{link.title}</a></li>);

  return (
    <div className="ltn__breadcrumb-area ltn__breadcrumb-area-4 ltn__breadcrumb-color-white---">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="ltn__breadcrumb-inner text-center">
              <h1 className="ltn__page-title">{title}</h1>
              <div className="ltn__breadcrumb-list">
                <ul>
                  {linksContent}
                  <li>{pageName}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(BreadcrumbComponent);
