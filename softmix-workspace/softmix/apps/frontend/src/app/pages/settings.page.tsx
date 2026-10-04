import { ChangeEvent, FormEvent, ReactNode, useEffect, useId, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ImageUp, Save } from 'lucide-react';
import { FileApi, SiteSettings, UrlPaths } from '@project-lib/shared-types';

import { useAppDispatch, useAppSelector } from '../hooks';
import { useDocumentTitle } from '../lib/use-document-title';
import { getSettings } from '../store/settings-data/selectors';
import { setSettings } from '../store/settings-data/settings-data';
import { rememberLogo } from '../store/settings-data/logo-cache';
import { Message } from '../const';
import { http } from '../services/http';
import { AdminPageHeader } from '../components/admin/admin-page-header';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Field, Input, Textarea } from '../ui/form';
import { FacebookIcon, InstagramIcon, PinterestIcon, XIcon } from '../ui/social-icons';

function SettingsSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <Card className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <div>
        <h2 className="font-semibold">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="grid gap-4">{children}</div>
    </Card>
  );
}

function SettingsPage() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(getSettings);
  const id = useId();

  const [logoUrl, setLogoUrl] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [copyright, setCopyright] = useState('');
  const [socialFacebook, setSocialFacebook] = useState('');
  const [socialInstagram, setSocialInstagram] = useState('');
  const [socialTwitter, setSocialTwitter] = useState('');
  const [socialPinterest, setSocialPinterest] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const settingsId = settings?.id;

  useDocumentTitle('Настройки сайта — панель управления');

  // Заполняем форму, когда настройки пришли с сервера.
  useEffect(() => {
    if (settings) {
      setLogoUrl(settings.logoUrl || '');
      setLogoPreview(settings.logoUrl || '');
      setPhone(settings.phone || '');
      setEmail(settings.email || '');
      setAddress(settings.address || '');
      setCompanyDescription(settings.companyDescription || '');
      setCopyright(settings.copyright || '');
      setSocialFacebook(settings.socialFacebook || '');
      setSocialInstagram(settings.socialInstagram || '');
      setSocialTwitter(settings.socialTwitter || '');
      setSocialPinterest(settings.socialPinterest || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsId]);

  const handleLogoChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];
    evt.target.value = '';
    if (!file) {
      return;
    }
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (loadEvt) => setLogoPreview(loadEvt.target?.result as string);
    reader.readAsDataURL(file);
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) {
      return logoUrl;
    }
    const formData = new FormData();
    formData.append('file', logoFile);
    try {
      const response = await http.post<FileApi>(`${UrlPaths.Uploader}/${UrlPaths.Products}/site-logo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });
      // Относительный путь: файл отдаёт nginx сайта, адрес работает на любом домене.
      return `/${response.data.url.replace(/^\/+/, '')}`;
    } catch {
      return null;
    }
  };

  const saveSettings = async (newLogoUrl: string) => {
    const data: Partial<SiteSettings> = {
      logoUrl: newLogoUrl,
      phone,
      email,
      address,
      companyDescription,
      copyright,
      socialFacebook,
      socialInstagram,
      socialTwitter,
      socialPinterest,
    };
    try {
      const response = await http.put<SiteSettings>(UrlPaths.Settings, data);
      dispatch(setSettings(response.data));
      rememberLogo(response.data.logoUrl);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setIsSaving(true);
    try {
      const newLogoUrl = await uploadLogo();
      if (newLogoUrl === null) {
        toast.error('Ошибка загрузки логотипа');
        return;
      }
      const isSaved = await saveSettings(newLogoUrl);
      if (isSaved) {
        setLogoUrl(newLogoUrl);
        setLogoFile(null);
        toast.success(Message.UpdateElement);
      } else {
        toast.error(Message.UnknownMessage);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const socials = [
    { key: 'facebook', label: 'Facebook', Icon: FacebookIcon, value: socialFacebook, set: setSocialFacebook, placeholder: 'https://facebook.com/...' },
    { key: 'instagram', label: 'Instagram', Icon: InstagramIcon, value: socialInstagram, set: setSocialInstagram, placeholder: 'https://instagram.com/...' },
    { key: 'twitter', label: 'Twitter', Icon: XIcon, value: socialTwitter, set: setSocialTwitter, placeholder: 'https://twitter.com/...' },
    { key: 'pinterest', label: 'Pinterest', Icon: PinterestIcon, value: socialPinterest, set: setSocialPinterest, placeholder: 'https://pinterest.com/...' },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <AdminPageHeader
        title="Настройки сайта"
        description="Логотип, контакты и ссылки — показываются в шапке, подвале и на странице контактов."
        actions={
          <Button type="submit" loading={isSaving}>
            {!isSaving && <Save />}
            Сохранить настройки
          </Button>
        }
      />

      <div className="grid gap-6">
        <SettingsSection title="Логотип" description="PNG, JPG, SVG или WebP.">
          <div className="flex flex-wrap items-center gap-5">
            <div className="grid h-28 w-52 place-items-center rounded-xl border border-dashed bg-white p-3">
              {logoPreview ? (
                <img src={logoPreview} alt="Логотип" className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-sm text-muted-foreground">Нет логотипа</span>
              )}
            </div>
            <div className="grid gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
                onChange={handleLogoChange}
              />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <ImageUp />
                Выбрать файл
              </Button>
              {logoFile && <p className="max-w-60 truncate text-sm text-muted-foreground">{logoFile.name}</p>}
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Контактная информация">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Телефон" htmlFor={`${id}-phone`}>
              <Input id={`${id}-phone`} value={phone} onChange={(evt) => setPhone(evt.target.value)} placeholder="Введите телефон" />
            </Field>
            <Field label="Email" htmlFor={`${id}-email`}>
              <Input id={`${id}-email`} value={email} onChange={(evt) => setEmail(evt.target.value)} placeholder="Введите email" />
            </Field>
          </div>
          <Field label="Адрес" htmlFor={`${id}-address`}>
            <Input id={`${id}-address`} value={address} onChange={(evt) => setAddress(evt.target.value)} placeholder="Введите адрес" />
          </Field>
        </SettingsSection>

        <SettingsSection title="О компании">
          <Field label="Описание компании" htmlFor={`${id}-description`}>
            <Textarea
              id={`${id}-description`}
              rows={5}
              value={companyDescription}
              onChange={(evt) => setCompanyDescription(evt.target.value)}
              placeholder="Введите описание компании"
            />
          </Field>
          <Field label="Копирайт" htmlFor={`${id}-copyright`} className="sm:max-w-sm">
            <Input id={`${id}-copyright`} value={copyright} onChange={(evt) => setCopyright(evt.target.value)} placeholder="Название компании" />
          </Field>
        </SettingsSection>

        <SettingsSection title="Социальные сети" description="Пустые ссылки на сайте не показываются.">
          <div className="grid gap-4 sm:grid-cols-2">
            {socials.map(({ key, label, Icon, value, set, placeholder }) => (
              <Field
                key={key}
                label={
                  <span className="inline-flex items-center gap-2">
                    <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                    {label}
                  </span>
                }
                htmlFor={`${id}-${key}`}
              >
                <Input id={`${id}-${key}`} type="url" value={value} onChange={(evt) => set(evt.target.value)} placeholder={placeholder} />
              </Field>
            ))}
          </div>
        </SettingsSection>

        <div className="flex justify-end">
          <Button type="submit" size="lg" loading={isSaving}>
            {!isSaving && <Save />}
            Сохранить настройки
          </Button>
        </div>
      </div>
    </form>
  );
}

export default SettingsPage;
