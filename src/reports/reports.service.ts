import { Injectable } from '@nestjs/common';
import { PrinterService } from 'src/printer/printer.service';
import { getPdfContent } from './admin-reports/hello-world.report';

@Injectable()
export class ReportsService {
  constructor(private readonly printerService: PrinterService) {}
  async testPdf(name: string) {
    const docDefinition = getPdfContent({ name });

    const doc = this.printerService.testPdf(docDefinition);

    return doc;
  }
}
