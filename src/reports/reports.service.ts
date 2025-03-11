import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './entities/report.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) { }

  async createReport(createReportDto: CreateReportDto): Promise<Report> {
    const report = this.reportRepository.create(createReportDto);
    return this.reportRepository.save(report);
  }

  async getReportStatus(): Promise<Report[]> {
    return this.reportRepository.find();
  }

  async downloadReport(id: number): Promise<Report> {
    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    return report;
  }
}