import { memo, ReactElement } from 'react';

import FooterAccountComponent from './footer-account.component';
import FooterLinksComponent from './footer-links.component';
import FooterInformationComponent from './footer-information.component';
import FooterSupportComponent from './footer-support.component';
import FooterAboutComponent from './footer-about.component';
import FooterRulesComponent from './footer-rules.component';

function FooterAreaComponent(): ReactElement {
  return (
    <footer className="ltn__footer-area ">
      <div className="footer-top-area section-bg-5">
        <div className="container">
          <div className="row">
            <FooterAccountComponent />
            <FooterLinksComponent />
            <FooterInformationComponent />
            <FooterSupportComponent />
            <FooterAboutComponent />
          </div>
        </div>
      </div>
      <FooterRulesComponent />
    </footer>
  )
}

export default memo(FooterAreaComponent);
