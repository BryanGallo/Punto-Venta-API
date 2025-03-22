import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminReportDto } from './create-admin-report.dto';

export class UpdateAdminReportDto extends PartialType(CreateAdminReportDto) {}
