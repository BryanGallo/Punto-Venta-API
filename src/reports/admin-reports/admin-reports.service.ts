import { Injectable } from '@nestjs/common';
import { PrinterService } from '../../printer/printer.service';
import { getPdfContent } from './templates/hello-world.report';

@Injectable()
export class AdminReportsService {
  constructor(private readonly PrinterService: PrinterService) {}
  async testPdf(name: string) {
    const docDefinition = getPdfContent({ name });

    const doc = this.PrinterService.testPdf(docDefinition);

    return doc;
  }
}
