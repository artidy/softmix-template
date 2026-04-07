import { ChangeEventHandler, memo } from 'react';

import { getFormatTitle } from '../../services/helpers';

type BtnCheckboxComponentProps = {
  value: string;
  name: string;
  values: string[];
  onChange: ChangeEventHandler;
}

function BtnCheckboxComponent({value, name, values, onChange}: BtnCheckboxComponentProps): JSX.Element {
  return (
    <div className="btn-checkbox">
      <label>
        <input
          className="visually-hidden"
          type="checkbox"
          name={name}
          value={value}
          onChange={onChange}
          checked={values.includes(value)}
        />
        <span className="btn-checkbox__btn">{getFormatTitle(value)}</span>
      </label>
    </div>
  )
}

export default memo(BtnCheckboxComponent);
