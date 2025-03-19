import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PrinterModule } from 'src/printer/printer.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrinterModule, AuthModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
