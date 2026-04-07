import { ChangeEvent, ReactElement, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';
import { SiteSettings, UrlPaths } from '@project-lib/shared-types';

import { useAppDispatch, useAppSelector } from '../hooks';
import { getSettings } from '../store/settings-data/selectors';
import { setSettings } from '../store/settings-data/settings-data';
import { Message, UPLOADER_URL } from '../const';
import { api } from '../store';

function SettingsPage(): ReactElement {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(getSettings);

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
  }, [settingsId]);

  const handleLogoChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setLogoPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return logoUrl;
    const formData = new FormData();
    formData.append('file', logoFile);
    const response = await api.post(
      `${UrlPaths.Uploader}/${UrlPaths.Products}/site-logo`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    if (isAxiosError(response)) return null;
    return `${UPLOADER_URL}assets/img/products/${response.data.name}`;
  };

  const saveSettings = async (newLogoUrl: string) => {
    const data: Partial<SiteSettings> = {
      logoUrl: newLogoUrl, phone, email, address, companyDescription,
      copyright, socialFacebook, socialInstagram, socialTwitter, socialPinterest,
    };
    const response = await api.put<SiteSettings>(`${UrlPaths.Settings}`, data);
    if (isAxiosError(response)) return false;
    dispatch(setSettings(response.data));
    return true;
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const newLogoUrl = await uploadLogo();
      if (newLogoUrl === null) { toast.error('Ошибка загрузки логотипа'); return; }
      const saved = await saveSettings(newLogoUrl);
      if (saved) { setLogoUrl(newLogoUrl); setLogoFile(null); toast.success(Message.UpdateElement); }
      else { toast.error(Message.UnknownMessage); }
    } catch { toast.error(Message.UnknownMessage); }
    finally { setIsSaving(false); }
  };

  return (
    <div className="ltn__form-box">
      {/* Logo section */}
      <div className="ltn__myaccount-tab-content-inner ltn__form-box mb-50">
        <h4 className="title-2">Логотип</h4>
        <div className="row align-items-center">
          <div className="col-sm-4 col-6 mb-20">
            <div style={{
              border: '2px dashed #e0e0e0',
              borderRadius: '12px',
              padding: '15px',
              minHeight: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fafafa',
              transition: 'border-color 0.3s',
            }}>
              {logoPreview ? (
                <img src={logoPreview} alt="Логотип"
                  style={{ maxWidth: '100%', maxHeight: '90px', objectFit: 'contain' }} />
              ) : (
                <span style={{ color: '#aaa', fontSize: '14px' }}>Нет логотипа</span>
              )}
            </div>
          </div>
          <div className="col-sm-8 col-6 mb-20">
            <input ref={fileInputRef} type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              style={{ display: 'none' }} onChange={handleLogoChange} />
            <button type="button" className="theme-btn-1 btn"
              onClick={() => fileInputRef.current?.click()}>
              <i className="fa fa-cloud-upload"></i> Выбрать файл
            </button>
            {logoFile && (
              <p className="mt-10" style={{ fontSize: '13px', color: '#888' }}>
                <i className="fa fa-file-image-o"></i> {logoFile.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Contact info */}
      <div className="ltn__myaccount-tab-content-inner ltn__form-box mb-50">
        <h4 className="title-2">Контактная информация</h4>
        <div className="row">
          <div className="col-md-6">
            <label>Телефон</label>
            <input type="text" name="phone" placeholder="Введите телефон"
              value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label>Email</label>
            <input type="text" name="email" placeholder="Введите email"
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="col-md-12">
            <label>Адрес</label>
            <input type="text" name="address" placeholder="Введите адрес"
              value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Company info */}
      <div className="ltn__myaccount-tab-content-inner ltn__form-box mb-50">
        <h4 className="title-2">О компании</h4>
        <div className="row">
          <div className="col-md-12">
            <label>Описание компании</label>
            <textarea name="description" rows={5} placeholder="Введите описание компании"
              value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label>Копирайт</label>
            <input type="text" name="copyright" placeholder="Название компании"
              value={copyright} onChange={(e) => setCopyright(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Social media */}
      <div className="ltn__myaccount-tab-content-inner ltn__form-box mb-50">
        <h4 className="title-2">Социальные сети</h4>
        <div className="row">
          <div className="col-md-6">
            <label><i className="fab fa-facebook-f"></i> Facebook</label>
            <input type="text" name="facebook" placeholder="https://facebook.com/..."
              value={socialFacebook} onChange={(e) => setSocialFacebook(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label><i className="fab fa-instagram"></i> Instagram</label>
            <input type="text" name="instagram" placeholder="https://instagram.com/..."
              value={socialInstagram} onChange={(e) => setSocialInstagram(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label><i className="fab fa-twitter"></i> Twitter</label>
            <input type="text" name="twitter" placeholder="https://twitter.com/..."
              value={socialTwitter} onChange={(e) => setSocialTwitter(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label><i className="fab fa-pinterest"></i> Pinterest</label>
            <input type="text" name="pinterest" placeholder="https://pinterest.com/..."
              value={socialPinterest} onChange={(e) => setSocialPinterest(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="btn-wrapper">
        <button className="theme-btn-1 btn btn-block" type="button"
          onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? (
            <><i className="fa fa-spinner fa-spin"></i> Сохранение...</>
          ) : (
            <><i className="fa fa-save"></i> Сохранить настройки</>
          )}
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
