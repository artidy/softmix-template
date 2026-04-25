export interface MailSettingsApi {
  enabled: boolean;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  fromAddress: string;
  adminEmail: string;
  shopName: string;
  shopUrl: string;
  hasUser: boolean;
  hasPassword: boolean;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateMailSettingsDto {
  enabled?: boolean;
  host?: string;
  port?: number;
  secure?: boolean;
  user?: string;
  password?: string;
  fromAddress?: string;
  adminEmail?: string;
  shopName?: string;
  shopUrl?: string;
}
