import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

import { IsString } from 'class-validator';

export class ResetPasswordUserDto {
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

  @IsString({ message: 'Contraseña no válida' })
  password_confirmation: string;
}
