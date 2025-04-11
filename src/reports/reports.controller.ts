import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportService } from './services/report.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@ApiTags('Reports')
@Controller('api/reports')
@UseGuards(JwtAuthGuard)
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

  @Get()
  getReports() {
    return this.reportService.getReports();
  }

  @Get('/download/:id')
  downloadReport(@Param('id') id: string) {
    return this.reportService.downloadReport(id);
  }

}
