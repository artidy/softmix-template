import { memo, ReactElement } from 'react';

type NewsItemComponentProps = {
  href: string;
  title: string;
  imageUrl: string;
  author: string;
  date: string;
}

function NewsItemComponent({href, title, imageUrl, author, date}: NewsItemComponentProps): ReactElement {
  return (
    <div className="col-lg-12">
      <div className="ltn__blog-item">
        <div className="ltn__blog-img">
          <a href={href}><img src={imageUrl} alt="#"/></a>
        </div>
        <div className="ltn__blog-brief">
          <div className="ltn__blog-meta">
            <ul>
              <li className="ltn__blog-author d-none">
                <a href="#">от: {author}</a>
              </li>
              <li>
                <span>{date}</span>
              </li>
              <li className="ltn__blog-comment">
                <a href="#"><i className="icon-speech"></i> 2</a>
              </li>
            </ul>
          </div>
          <h3 className="ltn__blog-title blog-title-line"><a href={href}>{title}</a></h3>
        </div>
      </div>
    </div>
  )
}

export default memo(NewsItemComponent);
