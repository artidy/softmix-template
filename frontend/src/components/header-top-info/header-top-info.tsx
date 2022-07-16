import HeaderTopItem from "../header-top-item";
import {ContactTypes} from "../../const";

const HeaderTopInfo = (): JSX.Element => {
  return (
    <ul className="header-top-info">
      <HeaderTopItem outline={'mail_outline'} title={'info@softmix.kz'} contactType={ContactTypes.Email} />
      <HeaderTopItem outline={'phone_in_talk'} title={'+77172787206'} contactType={ContactTypes.Phone} />
    </ul>
  )
}

export default HeaderTopInfo;
