import { Body, Controller, Post, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Response } from 'express';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  async create(@Res() response: Response) {
    const docPdf = await this.reportsService.create();

    response.setHeader('Content-Type', 'application/pdf');
    docPdf.pipe(response);
    docPdf.end();
  }
}
