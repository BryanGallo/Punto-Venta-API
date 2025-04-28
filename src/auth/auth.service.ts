import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { comparePassword, hashPassword } from '../common/utils/auth.util';
import { getJwtToken } from '../common/utils/jwt.util';
import { In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface.';
import { Role } from '../roles/entities/role.entity';
import { ForgotPasswordUser } from './dto/forgot-password-user.dto';
import { generateToken } from 'src/common/utils/token';
import { ValidateTokenUserDto } from './dto/validate-token-user.dto';
import { use } from 'passport';
import { ResetPasswordUserDto } from './dto/reset-password-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, roles: roleIds, ...userData } = createUserDto;

    const userExist = await this.userRepository.findOne({
      where: {
        email: userData.email,
      },
    });

    let errors: string[] = [];
    if (userExist) {
      errors.push(
        `El Usuario con el correo ${userData.email} ya se encuentra registrado`,
      );
      throw new ConflictException(errors);
    }

    const roles = await this.roleRepository.find({
      where: {
        id: In(roleIds),
      },
      order: {
        id: 'ASC',
      },
    });

    // Validamos que todos los IDs existen (longitud de resultados debe coincidir con roleIds)
    let error: string = '';
    if (roles.length !== roleIds.length) {
      error = null; // Si falta al menos un ID, devolvemos null
    }

    if (error === null) {
      errors.push('Al menos un rol asignado no existe');
      throw new NotFoundException(errors);
    }

    const user = await this.userRepository.create({
      ...userData,
      roles: roles,
      password: await hashPassword(password),
    });

    await this.userRepository.save(user);
    //* Operacion nativa de los objeto para eliminar una propiedad
    delete user.password;

    // return user;
    return { message: `El usuario fue creado correctamente` };
    // TODO: Retornar el JWT de acceso
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, email: true, password: true },
      relations: {
        roles: true,
      },
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
    return { token: this.getJwtToken({ id: user.id }) };

    //? En caso de que necesitemos que la funcion getJwtToken se utilice en otros lados esta creada en la capeta "util" el archivo jwt.util como ejemplo
    // return {
    //   ...user,
    //   token: getJwtToken({ email: user.email }, this.jwtService),
    // };
  }

  async forgotPassword(forgotPasswordUser: ForgotPasswordUser) {
    const { email } = forgotPasswordUser;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      let errors: string[] = [];
      errors.push('Usuario no encontrado');
      throw new NotFoundException(errors);
    }

    user.token = generateToken();
    // console.log(user);
    await this.userRepository.save(user);

    return {
      message: 'Revisa tu email para instrucciones',
    };
  }

  async validateToken(validateTokenUserDto: ValidateTokenUserDto) {
    const { token } = validateTokenUserDto;

    const user = await this.userRepository.findOne({
      where: { token },
    });

    if (!user) {
      let errors: string[] = [];
      errors.push('Token no valido');
      throw new NotFoundException(errors);
    }

    return {
      message: 'Token validado correctamente, actualice su contraseña',
    };
  }

  async resetPassword(
    resetPasswordUser: ResetPasswordUserDto,
    token: string,
  ) {
    const { password, password_confirmation } = resetPasswordUser;

    if (password !== password_confirmation) {
      let errors: string[] = [];
      errors.push('Las contraseñas no coinciden');
      throw new BadRequestException(errors);
    }

    const user = await this.userRepository.findOne({
      where: { token },
    });

    if (!user) {
      let errors: string[] = [];
      errors.push('Token no valido');
      throw new NotFoundException(errors);
    }

    user.password = await hashPassword(password);
    user.token = null;
    await this.userRepository.save(user);

    return {
      message: 'Contraseña actualizada correctamente',
    };
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
