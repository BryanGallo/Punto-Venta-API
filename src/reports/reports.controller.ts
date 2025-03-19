import { Body, Controller, Post, Res, ParseIntPipe } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Response } from 'express';
import { Auth } from '../auth/decorator/auth.decorator';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @Auth()
  async testPdf(@Body('name') name: string, @Res() response: Response) {
    const docPdf = await this.reportsService.testPdf(name);

    response.setHeader('Content-Type', 'application/pdf');
    docPdf.pipe(response);
    docPdf.end();
  }
}
