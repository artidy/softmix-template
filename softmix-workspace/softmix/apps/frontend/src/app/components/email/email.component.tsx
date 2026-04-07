import { memo, ReactElement } from 'react';

function EmailComponent(): ReactElement {
  return <a href="mailto:support@softmix.kz">support@softmix.kz</a>;
}

export default memo(EmailComponent);
