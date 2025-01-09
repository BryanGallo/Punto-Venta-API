import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        //*Del configService requiere usar el import y el inject
        // console.log("Del config",configService.get('JWT_SECRET'));
        //*Directamente de las variables de entorno
        // console.log("V entorno",process.env.JWT_SECRET);

        return {
          //?Usarmos la primera opcion ene se caso pero cualquierda de las 2 funciona
          secret: configService.get('JWT_SECRET'),
          // secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: '2h',
          },
        };
      },

      // useFactory: () => {
      //   return {
      //     secret: process.env.JWT_SECRET,
      //     signOptions: {
      //       expiresIn: '2h',
      //     },
      //   };
      // },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
