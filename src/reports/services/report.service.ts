import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateReportDto } from "../dto/create-report.dto";
import { Repository } from "typeorm";
import { Report } from "../entities/report.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(Report)
        private readonly reportRepository: Repository<Report>) { }
    async createReport(createReportDto: CreateReportDto) {
        const report = this.reportRepository.create(createReportDto);
        return this.reportRepository.save(report);
    }

    async getReportStatus() {
        return this.reportRepository.find();
    }

    async getReports() {
        return this.reportRepository.find();
    }

    async downloadReport(id: string) {
        const report = await this.reportRepository.findOneBy({ id: id });
        if (!report) {
            throw new NotFoundException('Report not found');
        }
        return report;
    }

}
