import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { UserRole } from '@project-lib/shared-types';

import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';

export function Auth(...roles: UserRole[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RoleGuard),
  );
}
