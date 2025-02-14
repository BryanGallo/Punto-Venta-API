import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Nombre no valido' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsString({ message: 'Email no valido' })
  @IsEmail({}, { message: 'No posee estructura de email' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @IsString({ message: 'Contraseña no válida' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe ser de mínimo de 6 caracteres' })
  @MaxLength(50, {
    message: 'La contraseña debe ser de máximo de 50 caracteres',
  })
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe tener una letra Mayuscula, una letra minuscula y un número',
  })
  password: string;

  @IsArray({ message: 'Rol no válido' })
  roles?: number[];
}
