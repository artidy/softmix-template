import { CSSProperties, memo, MouseEventHandler, ReactElement } from 'react';

type SliderArrowComponentNextProps = {
  className?: string | undefined;
  style?: CSSProperties | undefined;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}

function SliderArrowComponentNext({ className, style, onClick }: SliderArrowComponentNextProps): ReactElement {
  return (
    <button
      className={className}
      style={{...style}}
      onClick={onClick}
    >
      <i className="icon-arrow-right"/>
    </button>
  )
}

export default memo(SliderArrowComponentNext);
