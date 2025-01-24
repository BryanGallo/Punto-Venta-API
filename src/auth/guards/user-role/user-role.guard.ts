import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { use } from 'passport';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorator/role-protected.decorator';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    //? Nos permite obtener informacion de metadata de donde se coloque
    private readonly reflector: Reflector,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    if (!validRoles) {
      return true; // Si no hay roles definidos, deja pasar
    }

    if (validRoles.length === 0) return true;

    //?Obteniendo el usuario del contexto general
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    for (const role of user.roles) {
      if (validRoles.includes(role.name)) return true;
    }

    throw new BadRequestException(
      `El usuario ${user.name} no tiene un rol autorizado`,
    );
  }
}
