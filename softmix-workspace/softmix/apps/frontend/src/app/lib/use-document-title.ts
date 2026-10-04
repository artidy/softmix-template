import { useEffect } from 'react';

const SITE_NAME = 'Soft Mix';

/** Заголовок вкладки: «Страница — Soft Mix», без аргумента — только название сайта. */
export function useDocumentTitle(title?: string): void {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
  }, [title]);
}
