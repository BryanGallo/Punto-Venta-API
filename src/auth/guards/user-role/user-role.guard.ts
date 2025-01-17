import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { use } from 'passport';
import { Observable } from 'rxjs';
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
      'roles',
      context.getHandler(),
    );
    //?Obteniendo el usuario del contexto general
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    for (const role of user.roles) {
      if (validRoles.includes(role)) return true;
    }

    throw new BadRequestException(
      `El usuario ${user.name} no tiene un rol autorizado`,
    );
  }
}
