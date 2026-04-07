import { ChangeEvent, memo, ReactElement } from 'react';

type SearchPanelComponentProps = {
  className: string;
}

function SearchPanelComponent({className}: SearchPanelComponentProps): ReactElement {

  const onChangeSearch = (evt: ChangeEvent<HTMLInputElement>) => {
    console.log(evt.target.value);
  }

  return (
    <div className={className}>
      <form id="#123" method="get" action="#">
        <input
          type="text"
          name="search"
          value=""
          placeholder="Введите наименование товара..."
          onChange={onChangeSearch}
        />
        <button type="submit">
          <span><i className="icon-magnifier"></i></span>
        </button>
      </form>
    </div>
  )
}

export default memo(SearchPanelComponent);
