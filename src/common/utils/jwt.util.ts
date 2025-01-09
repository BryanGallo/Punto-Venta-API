import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface.';

/**
 * Función para generar un token JWT
 * @param payload - Datos que se incluirán en el token
 * @param jwtService - Instancia de JwtService
 * @returns Token JWT generado
 */

export const getJwtToken = (
  payload: JwtPayload,
  jwtService: JwtService,
): string => {
  const token = jwtService.sign(payload);
  return token;
};
