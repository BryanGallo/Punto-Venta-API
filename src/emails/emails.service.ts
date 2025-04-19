import { Injectable } from '@nestjs/common';
import { ValidateToken } from './dto/validate-token.dto';

@Injectable()
export class EmailsService {
  async validateToken(validateToken: ValidateToken) {
    return {
      message: 'Envio Correo',
    };
  }
}
