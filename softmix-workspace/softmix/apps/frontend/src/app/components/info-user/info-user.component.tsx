type InfoUserComponentProps = {
  title: string;
  children: JSX.Element;
}

function InfoUserComponent({title, children}: InfoUserComponentProps): JSX.Element {
  return (
    <main>
      <div className="popup-form popup-form--sign-up">
        <div className="popup-form__wrapper">
          <div className="popup-form__content">
            <div className="popup-form__title-wrapper">
              <h1 className="popup-form__title">{title}</h1>
            </div>
            <div className="popup-form__form">
              {children}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default InfoUserComponent;
