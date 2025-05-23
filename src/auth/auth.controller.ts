import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IncomingHttpHeaders } from 'http';
import { AuthService } from './auth.service';
import { GetUser, RawHeaders } from './decorator';
import { RoleProtected } from './decorator/role-protected.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces/valid-roles.enum';
import { Auth } from './decorator/auth.decorator';
import { ForgotPasswordUser } from './dto/forgot-password-user.dto';
import { ValidateTokenUserDto } from './dto/validate-token-user.dto';
import { ResetPasswordUserDto } from './dto/reset-password-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.create(createUserDto);
  }

  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordUser: ForgotPasswordUser) {
    return await this.authService.forgotPassword(forgotPasswordUser);
  }

  @Post('validate-token')
  async validateToken(@Body() validateTokenUserDto: ValidateTokenUserDto) {
    return await this.authService.validateToken(validateTokenUserDto);
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Body() resetPasswordUser: ResetPasswordUserDto,
    @Param('token') token: string,
  ) {
    return await this.authService.resetPassword(resetPasswordUser, token);
  }

  //?Rutas protegidas
  @Get('protected-route')
  @Auth()
  async validateRoute(@GetUser() user: User) {
    return {
      user,
    };
  }

  //TODO: EJemplo adicionales borrar a futuro
  //* Esta ruta privada es de ejemplo con diferentes caso de uso para futuras referencia - Solo valida si esta autenticado, autorizacion mas abajo
  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    //?Forma generica par obtener datos del reques
    // @Req() request: Express.Request
    //? Con decorador personalizado
    @GetUser() user: User,
    @GetUser('email') email: string,
    @RawHeaders() rawHeaders: IncomingHttpHeaders,
  ) {
    //?
    // const { user } = request;

    return {
      ok: true,
      message: 'Hola Mundo Private',
      user,
      email,
      rawHeaders,
    };
  }

  //* Vamos validar Autorizacion por roles - metodo generico usando guards
  //? Riegos error humano al escribir los roles o cambio de nombres
  @Get('private2')
  @SetMetadata('roles', ['super-admin', 'admin'])
  @UseGuards(AuthGuard(), UserRoleGuard)
  private2(@GetUser() user: User) {
    return { user };
  }

  //* Metodo Con custom decorator
  @Get('private3')
  @RoleProtected(ValidRoles.superAdmin, ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  async private3(@GetUser() user: User) {
    return {
      user,
    };
  }

  //* Usando Composición de decoradores
  @Get('private4')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin)
  async private4(@GetUser() user: User) {
    return {
      user,
    };
  }
}
