import { Injectable } from '@nestjs/common';
import { CreateCompetitorDto } from './dto/create-competitor.dto';
import { UpdateCompetitorDto } from './dto/update-competitor.dto';
import { Competitor } from 'src/financial/entities/competitor.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
  export class CompetitorService {
  constructor(
    @InjectRepository(Competitor)
    private competitorRepository: Repository<Competitor>,
  ) {}

  findAll() {
    return this.competitorRepository.find();
  }

  findOne(id: string) {
    return this.competitorRepository.findOneBy({ id });
  }

  update(id: string, updateCompetitorDto: UpdateCompetitorDto) {
    return this.competitorRepository.update(id, updateCompetitorDto);
  }

  remove(id: string) {
    return this.competitorRepository.delete(id);
  }
}
