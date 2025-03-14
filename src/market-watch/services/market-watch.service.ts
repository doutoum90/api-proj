import { Injectable } from '@nestjs/common';
import { AddCompetitorDto } from '../dto/add-competitor.dto';
import { Competitor } from '../entities/competitor.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MarketWatchService {
  constructor(
    @InjectRepository(Competitor)
    private competitorsRepository: Repository<Competitor>,
  ) { }
  create(createMarketWatchDto: AddCompetitorDto) {
    return this.competitorsRepository.save(createMarketWatchDto);
  }

  findAll() {
    return this.competitorsRepository.find();
  }

  findOne(id: string) {
    return this.competitorsRepository.findOne({ where: { id } });
  }

  remove(id: string) {
    return this.competitorsRepository.delete(id);
  }
}
