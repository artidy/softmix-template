import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@project-lib/shared-types';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
  }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const { user } = context.switchToHttp().getRequest();
    const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());

    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      return true;
    }

    return roles.includes(user.role);
  }
}
