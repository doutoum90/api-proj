import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { InjectRepository } from "@nestjs/typeorm";
import { Competitor } from "../market-watch/entities/competitor.entity";
import { Repository } from "typeorm";

@Injectable()
export class FinancialService {
  constructor(
    @InjectRepository(Competitor)
    private competitorRepository: Repository<Competitor>,
    private httpService: HttpService
  ) { }

  async getFinancialData(competitorId: string) {
    const competitor = await this.competitorRepository.findOneBy({ id: competitorId });

    const { data } = await firstValueFrom(
      this.httpService.get(`https://query1.finance.yahoo.com/v8/finance/chart/${competitor?.symbol}`)
    );

    return {
      symbol: competitor?.symbol,
      currentPrice: data.chart.result[0].meta.regularMarketPrice,
      marketCap: data.chart.result[0].meta.marketCap,
      peRatio: data.chart.result[0].meta.trailingPE,
      dividendYield: data.chart.result[0].meta.dividendYield
    };
  }


}