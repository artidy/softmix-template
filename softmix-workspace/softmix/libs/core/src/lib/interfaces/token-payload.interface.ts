import { UserRole } from '@project-lib/shared-types';

export interface TokenPayload {
  id: string;
  login: string;
  role: UserRole;
  name: string;
}
