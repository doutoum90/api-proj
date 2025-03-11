import { Injectable } from '@nestjs/common';
import { Competitors } from './entities/competitor.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Trends } from './entities/trends.entity';
import { News } from './entities/news.entity';
import { CreateCompetitorDto } from './dto/create-competitor.dto';

@Injectable()
export class VeilleService {
  constructor(
    @InjectRepository(Competitors)
    private competitorsRepository: Repository<Competitors>,
    @InjectRepository(Trends)
    private trendsRepository: Repository<Trends>,
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) { }
  addCompetitor(createCompetitorDto: CreateCompetitorDto) {
    return this.competitorsRepository.save(createCompetitorDto);
  }

  getAllCompetitors() {
    return this.competitorsRepository.find();
  }

  removeCompetitor(id: number) {
    return this.competitorsRepository.delete(id);
  }

  getAllTrends() {
    return this.trendsRepository.find();
  }

  getAllNews() {
    return this.newsRepository.find();
  }
}
