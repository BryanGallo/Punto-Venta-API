import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface.';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';

Injectable();
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;

    const user = await this.userRepository.findOne({
      relations: {
        roles: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
      },
      where: { id },
    });

    if (!user) {
      let errors: string[] = [];
      errors.push('Token no valido');
      throw new UnauthorizedException(errors);
    }

    if (!user.isActive) {
      let errors: string[] = [];
      errors.push('El usuario no esta activo');
      throw new UnauthorizedException(errors);
    }

    return user;
  }
}
