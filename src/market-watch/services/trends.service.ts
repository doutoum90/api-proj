import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MarketTrend } from "../entities/market-trend.entity";
import { firstValueFrom } from "rxjs";

@Injectable()
export class TrendsService {
    private readonly logger = new Logger(TrendsService.name);

    constructor(
        private readonly httpService: HttpService,
        @InjectRepository(MarketTrend)
        private trendsRepository: Repository<MarketTrend>
    ) { }

    async getTrends(region: string): Promise<MarketTrend[]> {
        // Vérifier le cache
        const cached = await this.trendsRepository.findOne({
            where: { region },
            order: { date: 'DESC' }
        });

        if (cached && new Date().getTime() - cached.date.getTime() < 3600000) {
            return [cached];
        }

        // Récupérer depuis Google Trends
        try {
            const trends = await this.fetchGoogleTrends(region);
            const newTrend = this.trendsRepository.create({
                keyword: 'default',
                trendData: trends,
                date: new Date(),
                region
            });

            await this.trendsRepository.save(newTrend);
            return [newTrend];
        } catch (error) {
            this.logger.error('Failed to fetch trends', error.stack);
            return cached ? [cached] : [];
        }
    }

    private async fetchGoogleTrends(region: string) {
        const { data } = await firstValueFrom(
            this.httpService.get(`https://trends.google.com/trends/api/dailytrends?geo=${region}`)
        );

        // Nettoyer la réponse de Google
        const jsonStr = data.replace(/^\)\]\}'/, '');
        return JSON.parse(jsonStr).default.trendingSearchesDays[0].trendingSearches;
    }
}