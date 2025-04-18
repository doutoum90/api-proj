import { Injectable } from "@nestjs/common";
import { Competitor } from "../entities/competitor.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AddCompetitorDto } from "../dto/add-competitor.dto";

@Injectable()
export class CompetitorsService {
  constructor(
    @InjectRepository(Competitor)
    private competitorsRepository: Repository<Competitor>
  ) { }

  async findAll(): Promise<Competitor[]> {
    return this.competitorsRepository.find();
  }

  async create(dto: AddCompetitorDto): Promise<Competitor> {
    const competitor = this.competitorsRepository.create(dto);
    return this.competitorsRepository.save(competitor);
  }

  async remove(id: string): Promise<void> {
    await this.competitorsRepository.delete(id);
  }
}