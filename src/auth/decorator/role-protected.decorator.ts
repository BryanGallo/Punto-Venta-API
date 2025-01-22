import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces/valid-roles.enum';

//? Asignamos a una variable para futuro si es necesario cambiar el nombre y solo tener que hacerlo aqui
export const META_ROLES = 'roles';

export const RoleProtected = (...args: ValidRoles[]) => {
  
  return SetMetadata(META_ROLES, args);
};
