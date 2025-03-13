import { Injectable } from '@nestjs/common';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import { PrinterService } from 'src/printer/printer.service';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly printerService: PrinterService) {}
  async create() {
    const docDefinition : TDocumentDefinitions = {
      content:['Hola desde MakePdf']
    }

    const doc = this.printerService.createPdf(docDefinition);

    return doc;
  }
}
