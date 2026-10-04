import { cn } from '../lib/cn';
import { useAppSelector } from '../hooks';
import { getIsSettingsLoading, getSettings } from '../store/settings-data/selectors';

const DEFAULT_LOGO = '/assets/img/logo.png';

/** Логотип компании: загруженный в настройках сайта или стандартный файл. */
export function Logo({ className }: { className?: string }) {
  const settings = useAppSelector(getSettings);
  const isLoading = useAppSelector(getIsSettingsLoading);

  // Пока грузятся настройки, держим место, чтобы не мигал стандартный логотип.
  if (!settings && isLoading) {
    // Пропорции стандартного логотипа 273×158.
    return <span className={cn('block aspect-[273/158] h-12', className)} aria-hidden="true" />;
  }

  return <img src={settings?.logoUrl || DEFAULT_LOGO} alt="Soft Mix" className={cn('h-12 w-auto', className)} />;
}
