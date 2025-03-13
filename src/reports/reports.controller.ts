import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportService } from './services/report.service';
@Controller('api/reports')
export class ReportsController {
  constructor(private readonly reportService: ReportService) { }

  @Post('/request')
  requestReport(@Body() createReportDto: CreateReportDto) {
    return this.reportService.createReport(createReportDto);
  }

  @Get('/status')
  getReportStatus() {
    return this.reportService.getReportStatus();
  }

  @Get('/download/:id')
  downloadReport(@Param('id') id: string) {
    return this.reportService.downloadReport(id);
  }

}
