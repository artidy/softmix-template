import { ImgHTMLAttributes, SyntheticEvent, useCallback, useState } from 'react';

import { cn } from '../lib/cn';

type FadeImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  /** Пустая строка — для декоративной картинки рядом с подписью. */
  alt: string;
  /** Картинка на случай, если основная не загрузилась (битая ссылка поставщика и т. п.). */
  fallbackSrc?: string;
};

/** Картинка, которая мягко проявляется после загрузки, а не «выпрыгивает». */
export function FadeImage({ className, fallbackSrc, onLoad, onError, src, alt, ...props }: FadeImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [failedSrc, setFailedSrc] = useState<string | undefined>();
  const currentSrc = failedSrc && failedSrc === src && fallbackSrc ? fallbackSrc : src;

  // Картинка из кэша браузера бывает загружена ещё до подписки на onLoad.
  const ref = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, []);

  const handleLoad = (evt: SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    onLoad?.(evt);
  };

  const handleError = (evt: SyntheticEvent<HTMLImageElement>) => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setFailedSrc(src);
    } else {
      // Без запасной картинки показываем пустое место, а не значок битого файла.
      setIsLoaded(false);
    }
    onError?.(evt);
  };

  return (
    <img
      ref={ref}
      src={currentSrc}
      alt={alt}
      onLoad={handleLoad}
      onError={handleError}
      className={cn('transition-[opacity,scale,translate] duration-300 ease-out', isLoaded ? 'opacity-100' : 'opacity-0', className)}
      {...props}
    />
  );
}
