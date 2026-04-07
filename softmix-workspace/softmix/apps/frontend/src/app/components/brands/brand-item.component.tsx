import { memo, ReactElement } from 'react';

type BrandItemComponentProps = {
  imageUrl: string;
  name: string;
}

function BrandItemComponent({imageUrl, name}: BrandItemComponentProps): ReactElement {
  return (
    <div className="col-lg-12">
      <div className="ltn__brand-logo-item">
        <img src={imageUrl} alt={name} />
      </div>
    </div>
  )
}

export default memo(BrandItemComponent);
