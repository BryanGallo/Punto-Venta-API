import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString({ message: 'Nombre no valido' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsString({ message: 'Descripcion no valida' })
  @IsOptional()
  description?: string;
}
