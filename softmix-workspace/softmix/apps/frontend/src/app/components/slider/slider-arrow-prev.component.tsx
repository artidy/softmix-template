import { CSSProperties, memo, MouseEventHandler, ReactElement } from 'react';

type SliderArrowComponentPrevProps = {
  className?: string | undefined;
  style?: CSSProperties | undefined;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}

function SliderArrowComponentPrev({ className, style, onClick }: SliderArrowComponentPrevProps): ReactElement {
  return (
    <button
      className={className}
      style={{...style}}
      onClick={onClick}
    >
      <i className="icon-arrow-left" />
    </button>
  )
}

export default memo(SliderArrowComponentPrev);
