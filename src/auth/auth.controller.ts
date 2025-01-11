import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { request } from 'http';
import { GetUser } from './decorator/get-user.decorator';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    //?Forma generica par obtener datos del reques
    // @Req() request: Express.Request
    //? Con decorador personalizado
    @GetUser() user: User,
  ) {
    //?
    // const { user } = request;
    console.log(user);

    return {
      ok: true,
      message: 'Hola Mundo Private',
      user,
    };
  }
}
