import { ChangeEventHandler, memo, MouseEvent, ReactElement, useRef } from 'react';

type InputLoadAvatarComponentProps = {
  onChangeImage: ChangeEventHandler;
}

function UploadImageComponent({onChangeImage}: InputLoadAvatarComponentProps): ReactElement {
  const imageInput = useRef(null);

  const onClickChangeImage = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();

    imageInput.current.click();
  }

  return (
    <div className="upload-image">
      <input
        ref={imageInput}
        className="visually-hidden"
        type="file"
        name="upload-image"
        accept="image/png, image/jpeg"
        onChange={onChangeImage}
        readOnly={true}
      />
      <button className="btn-edit" onClick={onClickChangeImage}>
        <i className="fa fa-image"></i>
      </button>
    </div>
  )
}

export default memo(UploadImageComponent);
