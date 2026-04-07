import { Request } from 'express';
import { UserRequest } from '@project-lib/shared-types';

export interface ExtendedRequest extends Request {
  user: UserRequest | undefined;
}
