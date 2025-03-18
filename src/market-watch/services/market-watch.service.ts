import { Injectable } from '@nestjs/common';
import { AddCompetitorDto } from '../dto/add-competitor.dto';
import { Competitor } from '../entities/competitor.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MarketTrend } from '../entities/market-trend.entity';
import { MarketShare } from '../entities/market-share.entity';
import { MarketPrice } from '../entities/market-Price.entity';
import axios from 'axios';

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

  // Simuler la récupération des tendances via Google Trends API
  async getMarketTrends(period: string = 'daily'): Promise<MarketTrend[]> {
    // Exemple : Appel simulé à Google Trends API
    const response = await axios.get('https://api.googletrends.com/trends', {
      params: { period },
    });
    const trends = [
      { keyword: 'competitor1', trendScore: 75, period },
      { keyword: 'competitor2', trendScore: 60, period },
    ]; // Données mockées

    await this.marketTrendRepository.save(trends);
    return this.marketTrendRepository.find({ where: { period } });
  }

  // Simuler la récupération des parts de marché via SEMrush ou autre
  async getMarketShare(): Promise<MarketShare[]> {
    // Exemple : Appel simulé à SEMrush API
    const response = await axios.get('https://api.semrush.com/market-share');
    const shares = [
      { competitor: 'competitor1', sharePercentage: 35.5 },
      { competitor: 'competitor2', sharePercentage: 25.0 },
    ]; // Données mockées

    await this.marketShareRepository.save(shares);
    return this.marketShareRepository.find();
  }

  // Simuler la récupération des prix via scraping ou API
  async getMarketPrices(period: string = 'daily'): Promise<MarketPrice[]> {
    // Exemple : Appel simulé à une API de prix
    const response = await axios.get('https://api.marketdata.com/prices', {
      params: { period },
    });
    const prices = [
      { product: 'product1', price: 99.99, period },
      { product: 'product2', price: 149.99, period },
    ]; // Données mockées


    await this.marketPriceRepository.save(prices);
    return this.marketPriceRepository.find({ where: { period } });
  }
}