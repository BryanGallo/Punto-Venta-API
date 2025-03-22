import {
  Body,
  Controller,
  Post,
  Res
} from '@nestjs/common';
import { Response } from 'express';
import { AdminReportsService } from './admin-reports.service';
import { Auth } from 'src/auth/decorator/auth.decorator';

@Controller('admin-reports')
export class AdminReportsController {
  constructor(private readonly adminReportsService: AdminReportsService) {}

  @Post()
  @Auth()
  async testPdf(@Body('name') name: string, @Res() response: Response) {
    const docPdf = await this.adminReportsService.testPdf(name);

    response.setHeader('Content-Type', 'application/pdf');
    docPdf.pipe(response);
    docPdf.end();
  }
}
