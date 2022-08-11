type PopupSideComponentProps = {
  additionalClass: string;
  isOpen: boolean;
  toggleOpen: Function;
  children: JSX.Element;
}

const PopupSideComponent = ({additionalClass, isOpen, toggleOpen, children}: PopupSideComponentProps): JSX.Element => {
  const onClick = () => {
    toggleOpen(false);
  }

  return (
    <>
      <div className={`side side-right ${isOpen ? 'open' : ''} ${additionalClass}`}>
        <div className="side-scroll">
          {children}
        </div>
        <div className="side-close" onClick={onClick}><i className="material-icons md-24">close</i></div>
      </div>
      <div className={`mf-bg ${isOpen ? 'visible side-visible' : ''}`}></div>
    </>
  )
}

export default PopupSideComponent;
