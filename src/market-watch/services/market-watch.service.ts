import { Injectable, NotFoundException } from '@nestjs/common';
import { AddCompetitorDto } from '../dto/add-competitor.dto';
import { Competitor } from '../entities/competitor.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MarketTrend } from '../entities/market-trend.entity';
import { MarketShare } from '../entities/market-share.entity';
import { MarketPrice } from '../entities/market-Price.entity';
import { CompetitorDataSource, DataSourceType } from '../entities/competitor-data-source.entity';
import { CompetitorKPI } from '../entities/competitor-kpi.entity';
import { AddCompetitorDataSourceDto } from '../dto/add-competitor-data-source.dto';
import { AddCompetitorKPIDto } from '../dto/add-competitor-kpi.dto';
import { Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const logger = new Logger('MarketWatchService');

@Injectable()
export class MarketWatchService {
  constructor(
    @InjectRepository(Competitor)
    private competitorsRepository: Repository<Competitor>,
    @InjectRepository(MarketTrend)
    private marketTrendRepository: Repository<MarketTrend>,
    @InjectRepository(MarketShare)
    private marketShareRepository: Repository<MarketShare>,
    @InjectRepository(MarketPrice)
    private marketPriceRepository: Repository<MarketPrice>,
    @InjectRepository(CompetitorDataSource)
    private dataSourceRepository: Repository<CompetitorDataSource>,
    @InjectRepository(CompetitorKPI)
    private kpiRepository: Repository<CompetitorKPI>,
    private httpService: HttpService,
  ) { }

  async create(createMarketWatchDto: AddCompetitorDto) {
    const competitor = this.competitorsRepository.create(createMarketWatchDto);
    return this.competitorsRepository.save(competitor);
  }

  async findAll() {
    return this.competitorsRepository.find({
      relations: ['dataSources', 'kpis']
    });
  }

  async findOne(id: string) {
    const competitor = await this.competitorsRepository.findOne({
      where: { id },
      relations: ['dataSources', 'kpis']
    });

    if (!competitor) {
      throw new NotFoundException(`Concurrent avec l'ID ${id} non trouvé`);
    }

    return competitor;
  }

  async remove(id: string) {
    const competitor = await this.findOne(id);
    return this.competitorsRepository.remove(competitor);
  }

  async addDataSource(competitorId: string, dataSourceDto: AddCompetitorDataSourceDto) {
    const competitor = await this.findOne(competitorId);
    
    const dataSource = this.dataSourceRepository.create({
      ...dataSourceDto,
      competitor,
      addedDate: new Date(),
    });

    await this.dataSourceRepository.save(dataSource);
    return this.findOne(competitorId);
  }

  async updateDataSource(competitorId: string, dataSourceId: string, dataSourceDto: AddCompetitorDataSourceDto) {
    const competitor = await this.findOne(competitorId);
    const dataSource = competitor.dataSources.find(ds => ds.id === dataSourceId);
    
    if (!dataSource) {
      throw new NotFoundException(`Source de données avec l'ID ${dataSourceId} non trouvée`);
    }

    dataSource.type = dataSourceDto.type;
    dataSource.url = dataSourceDto.url;
    dataSource.description = dataSourceDto.description || '';

    await this.dataSourceRepository.save(dataSource);
    return this.findOne(competitorId);
  }

  async removeDataSource(competitorId: string, dataSourceId: string) {
    const competitor = await this.findOne(competitorId);
    const dataSource = competitor.dataSources.find(ds => ds.id === dataSourceId);

    if (!dataSource) {
      throw new NotFoundException(`Source de données avec l'ID ${dataSourceId} non trouvée`);
    }

    await this.dataSourceRepository.remove(dataSource);
    return this.findOne(competitorId);
  }

  async addKPI(competitorId: string, kpiDto: AddCompetitorKPIDto) {
    const competitor = await this.findOne(competitorId);
    
    const kpi = this.kpiRepository.create({
      ...kpiDto,
      competitor,
      date: new Date(),
    });

    await this.kpiRepository.save(kpi);
    return this.findOne(competitorId);
  }

  async removeKPI(competitorId: string, kpiId: string) {
    const competitor = await this.findOne(competitorId);
    const kpi = competitor.kpis.find(k => k.id === kpiId);

    if (!kpi) {
      throw new NotFoundException(`KPI avec l'ID ${kpiId} non trouvé`);
    }

    await this.kpiRepository.remove(kpi);
    return this.findOne(competitorId);
  }

  async getMarketTrends(period: string = 'daily'): Promise<MarketTrend[]> {
    try {
      const competitors = await this.competitorsRepository.find({
        relations: ['dataSources']
      });

      const trends: MarketTrend[] = [];

      for (const competitor of competitors) {
        const trendsSources = competitor.dataSources.filter(source => 
          source.type === DataSourceType.TRENDS || source.type === DataSourceType.GOOGLE_TRENDS
        );

        for (const source of trendsSources) {
          try {
            const response = await firstValueFrom(
              this.httpService.get(source.url, {
                params: { 
                  period,
                  keyword: competitor.keywords.join(','),
                  region: 'FR'
                }
              })
            );

            const trend = this.marketTrendRepository.create({
              keyword: competitor.name,
              trendScore: response.data.score || 0,
              period,
              region: 'FR',
              date: new Date(),
              trendData: response.data
            });

            trends.push(trend);
          } catch (err: any) {
            logger.error(`Erreur lors de la récupération des tendances pour ${competitor.name}:`, err.message);
          }
        }
      }

      if (trends.length > 0) {
        await this.marketTrendRepository.save(trends);
      }

      return this.marketTrendRepository.find({ 
        where: { period },
        order: { date: 'DESC' }
      });
    } catch (err: any) {
      logger.error('Erreur lors de la récupération des tendances:', err.message);
      return [];
    }
  }

  async getMarketShare(): Promise<MarketShare[]> {
    try {
      const competitors = await this.competitorsRepository.find({
        relations: ['dataSources']
      });

      const shares: MarketShare[] = [];

      for (const competitor of competitors) {
        const marketSources = competitor.dataSources.filter(source => 
          source.type === DataSourceType.MARKET_SHARE || source.type === DataSourceType.SEMRUSH
        );

        for (const source of marketSources) {
          try {
            const response = await firstValueFrom(
              this.httpService.get(source.url, {
                params: { 
                  domain: competitor.domain,
                  industry: competitor.industry
                }
              })
            );

            const share = this.marketShareRepository.create({
              competitor: competitor.name,
              sharePercentage: response.data.sharePercentage || 0,
              timestamp: new Date()
            });

            shares.push(share);
          } catch (err: any) {
            logger.error(`Erreur lors de la récupération des parts de marché pour ${competitor.name}:`, err.message);
          }
        }
      }

      if (shares.length > 0) {
        await this.marketShareRepository.save(shares);
      }

      return this.marketShareRepository.find({
        order: { timestamp: 'DESC' }
      });
    } catch (err: any) {
      logger.error('Erreur lors de la récupération des parts de marché:', err.message);
      return [];
    }
  }

  async getMarketPrices(period: string = 'daily'): Promise<MarketPrice[]> {
    try {
      const competitors = await this.competitorsRepository.find({
        relations: ['dataSources']
      });

      const prices: MarketPrice[] = [];

      for (const competitor of competitors) {
        const priceSources = competitor.dataSources.filter(source => 
          source.type === DataSourceType.PRICE || source.type === DataSourceType.FINANCIAL
        );

        for (const source of priceSources) {
          try {
            const response = await firstValueFrom(
              this.httpService.get(source.url, {
                params: { 
                  symbol: competitor.symbol,
                  period
                }
              })
            );

            const price = this.marketPriceRepository.create({
              product: competitor.name,
              price: response.data.price || 0,
              period,
              timestamp: new Date()
            });

            prices.push(price);
          } catch (err: any) {
            logger.error(`Erreur lors de la récupération des prix pour ${competitor.name}:`, err.message);
          }
        }
      }

      if (prices.length > 0) {
        await this.marketPriceRepository.save(prices);
      }

      return this.marketPriceRepository.find({
        where: { period },
        order: { timestamp: 'DESC' }
      });
    } catch (err: any) {
      logger.error('Erreur lors de la récupération des prix:', err.message);
      return [];
    }
  }
}