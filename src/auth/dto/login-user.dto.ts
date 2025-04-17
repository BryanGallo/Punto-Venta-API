import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsString({ message: 'Email no valido' })
  @IsEmail({}, { message: 'No posee estructura de email' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @IsString({ message: 'Contraseña no válida' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;
}
