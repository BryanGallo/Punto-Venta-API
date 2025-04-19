import { Body, Controller, Post } from '@nestjs/common';
import { ValidateToken } from './dto/validate-token.dto';
import { EmailsService } from './emails.service';

@Controller('auth')
export class EmailsController {
  constructor(
    private readonly emailsService: EmailsService,
  ) {}

  //TODO : Este controlador solo se usa para validar los correos
  
  @Post('email/validate-token')
  validateToken(@Body() validateToken: ValidateToken) {
    return this.emailsService.validateToken(validateToken);
  }
}
