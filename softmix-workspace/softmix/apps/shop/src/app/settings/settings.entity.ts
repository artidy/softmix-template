import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SiteSettings } from '@project-lib/shared-types';

@Entity({ name: 'site_settings' })
export class SettingsEntity implements SiteSettings {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: 'logo_url', default: 'assets/img/logo.png' })
  logoUrl: string;

  @Column({ default: '78-72-06' })
  phone: string;

  @Column({ default: 'support@softmix.kz' })
  email: string;

  @Column({ default: 'Астана, ул. Достык 20 БЦ "Санкт-Петербург" офис 401' })
  address: string;

  @Column({ name: 'company_description', type: 'text', default: '' })
  companyDescription: string;

  @Column({ default: 'Soft Mix' })
  copyright: string;

  @Column({ name: 'social_facebook', default: '' })
  socialFacebook: string;

  @Column({ name: 'social_instagram', default: '' })
  socialInstagram: string;

  @Column({ name: 'social_twitter', default: '' })
  socialTwitter: string;

  @Column({ name: 'social_pinterest', default: '' })
  socialPinterest: string;
}
