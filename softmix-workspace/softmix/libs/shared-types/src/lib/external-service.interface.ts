export enum AuthType {
  None = 'none',
  Bearer = 'bearer',
  QueryParam = 'query-param',
  ApiKey = 'api-key',
  BasicAuth = 'basic-auth',
}

export interface ExternalServiceHeader {
  key: string;
  value: string;
}

export interface ExternalService {
  id?: string;
  name: string;
  baseUrl: string;
  basePath: string;
  authType: AuthType;
  authToken: string;
  authParamName: string;
  headers: ExternalServiceHeader[];
  timeout: number;
  forwardHeaders: boolean;
  isActive: boolean;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}
