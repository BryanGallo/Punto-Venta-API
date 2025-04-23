import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateTokenUserDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
