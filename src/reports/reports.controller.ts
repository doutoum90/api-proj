import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';

@Controller('api/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('/request')
  requestReport(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.createReport(createReportDto);
  }

  @Get('/status')
  getReportStatus() {
    return this.reportsService.getReportStatus();
  }

  @Get('/download/:id')
  downloadReport(@Param('id') id: string) {
    return this.reportsService.downloadReport(+id);
  }

}
