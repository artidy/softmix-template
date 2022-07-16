import {ContactTypes} from "../../const";

type HeaderTopItemProps = {
  outline: string;
  title: string;
  contactType: ContactTypes;
}

const HeaderTopItem = ({outline, title, contactType}: HeaderTopItemProps): JSX.Element => {
  return (
    <li>
      <a href={`${contactType}:${title}`}>
        <i className="material-icons md-18">{outline}</i>
        <span>{title}</span>
      </a>
    </li>
  )
}
