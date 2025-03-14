import { Injectable } from '@nestjs/common';
import PdfPrinter from 'pdfmake';
import type { BufferOptions, TDocumentDefinitions } from 'pdfmake/interfaces';

const fonts = {
  Roboto: {
    normal: 'fonts/Roboto-Regular.ttf',
    bold: 'fonts/Roboto-Bold.ttf',
    italics: 'fonts/Roboto-Italic.ttf',
    bolditalics: 'fonts/Roboto-BoldItalic.ttf',
  },
};

@Injectable()
export class PrinterService {
  private printer = new PdfPrinter(fonts);

  async testPdf(
    docDefinition: TDocumentDefinitions,
    options: BufferOptions = {},
  ): Promise<PDFKit.PDFDocument> {
    return this.printer.createPdfKitDocument(docDefinition, options);
  }
}
