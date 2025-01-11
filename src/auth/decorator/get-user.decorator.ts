import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { In } from 'typeorm';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  console.log({ data });
  //? ctx es el contexto en el cual se ejecuta la funcion
  const req = ctx.switchToHttp().getRequest();
  const user = req.user;
  console.log(req);

  if (!user) {
    throw new InternalServerErrorException('Usuario no encontrado(request)');
  }

  return user;
});
