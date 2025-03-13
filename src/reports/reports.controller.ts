import { Body, Controller, Post, Res } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportsService } from './reports.service';
import { Response } from 'express';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  async create(
    @Body() createReportDto: CreateReportDto,
    @Res() response: Response,
  ) {
    const docPdf = await this.reportsService.create();

    response.setHeader('Content-Type', 'application/pdf')
    docPdf.pipe(response)
    docPdf.end()

    
  }
}
