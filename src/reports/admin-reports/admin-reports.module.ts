import { Module } from '@nestjs/common';
import { AdminReportsService } from './admin-reports.service';
import { AdminReportsController } from './admin-reports.controller';
import { PrinterModule } from 'src/printer/printer.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrinterModule, AuthModule],
  controllers: [AdminReportsController],
  providers: [AdminReportsService],
})
export class AdminReportsModule {}
