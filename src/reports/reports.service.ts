import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import PdfPrinter from 'pdfmake';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';

const fonts = {
  Roboto: {
    normal: 'fonts/Roboto-Regular.ttf',
    bold: 'fonts/Roboto-Bold.ttf',
    italics: 'fonts/Roboto-Italic.ttf',
    bolditalics: 'fonts/Roboto-BoldItalic.ttf',
  },
};

@Injectable()
export class ReportsService {
  async create(createReportDto: CreateReportDto) {
    const printer = new PdfPrinter(fonts);

    const docDefinition : TDocumentDefinitions = {
      content:['Hola desde MakePdf']
    }
    const doc = printer.createPdfKitDocument(docDefinition)

    return doc;
  }
}
