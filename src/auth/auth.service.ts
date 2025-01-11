import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { comparePassword, hashPassword } from 'src/common/utils/auth.util';
import { getJwtToken } from 'src/common/utils/jwt.util';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface.';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = await this.userRepository.create({
        ...userData,
        password: await hashPassword(password),
      });

      await this.userRepository.save(user);
      //* Operacion nativa de los objeto para eliminar una propiedad
      delete user.password;

      return user;
      // TODO: Retornar el JWT de acceso
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, email: true, password: true },
    });

    if (!user) {
      let errors: string[] = [];
      errors.push('Credenciales incorrectas (email)');
      throw new UnauthorizedException(errors);
    }

    const validation = await comparePassword(password, user.password);
    if (!validation) {
      let errors: string[] = [];
      errors.push('Credenciales incorrectas (contraseña)');
      throw new UnauthorizedException(errors);
    }

    //* usando la funcion interna de este servicio private getJwtToken
    return { ...user, token: this.getJwtToken({ id: user.id }) };

    //? En caso de que necesitemos que la funcion getJwtToken se utilice en otros lados esta creada en la capeta "util" el archivo jwt.util como ejemplo
    // return {
    //   ...user,
    //   token: getJwtToken({ email: user.email }, this.jwtService),
    // };
  }

  private getJwtToken = (payload: JwtPayload) => {
    const token = this.jwtService.sign(payload);
    return token;
  };

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    throw new InternalServerErrorException('Error revisa los logs');
  }
}
