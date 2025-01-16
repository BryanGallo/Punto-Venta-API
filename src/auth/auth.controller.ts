import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { IncomingHttpHeaders, request } from 'http';
import { User } from './entities/user.entity';
import { GetUser, RawHeaders } from './decorator';
import { UserRoleGuard } from './guards/user-role/user-role.guard';

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

  //* Esta ruta privada es de ejemplo con diferentes caso de uso para futuras referencia
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

  //* Vamos validar roles - metodo generico usando guards
  @Get('private2')
  @SetMetadata('roles', ['super-admin', 'admin'])
  @UseGuards(AuthGuard(), UserRoleGuard)
  private2(@GetUser() user: User) {
    return { user };
  }
}
