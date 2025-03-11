import { Injectable } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';
import { Alert } from './entities/alert.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Regulation } from './entities/regulation.entity';


@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert)
    private alertRepository: Repository<Alert>,
    @InjectRepository(Regulation)
    private regulationRepository: Repository<Regulation>,
  ) { }

  getAllAlerts() {
    return this.alertRepository.find();
  }

  subscribe(createAlertDto: CreateAlertDto) {
    return this.alertRepository.save(createAlertDto);
  }

  unsubscribe(createAlertDto: CreateAlertDto) {
    return this.alertRepository.delete(createAlertDto.id);
  }

  getAllRegulations() {
    return this.regulationRepository.find();
  }
}
