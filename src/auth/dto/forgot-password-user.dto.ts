import { PickType } from '@nestjs/mapped-types';
import { LoginUserDto } from './login-user.dto';

export class ForgotPasswordUser extends PickType(LoginUserDto, ['email']) {}
