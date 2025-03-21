import { Controller, Get, Post, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AddCompetitorDto } from '../dto/add-competitor.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MarketWatchService } from '../services/market-watch.service';
import { PeriodQueryDto } from '../dto/period-query.dto';
import { MarketTrend } from '../entities/market-trend.entity';
import { MarketShare } from '../entities/market-share.entity';
import { MarketPrice } from '../entities/market-Price.entity';

@ApiTags('Veille - Concurrents')
@Controller('api/veille/competitors')
@UseGuards(JwtAuthGuard)
export class CompetitorsController {

    constructor(private readonly marketService: MarketWatchService) { }
    @Get()
    @ApiOperation({ summary: 'Liste des concurrents surveillés' })
    async getCompetitors() {
        return this.marketService.findAll();
    }

    @Post('add')
    @ApiOperation({ summary: 'Ajouter un nouveau concurrent' })
    async addCompetitor(@Body() dto: AddCompetitorDto) {
        return this.marketService.create(dto);
    }

    @Delete('remove/:id')
    @ApiOperation({ summary: 'Supprimer un concurrent' })
    async removeCompetitor(@Param('id') id: string) {
        return this.marketService.remove(id);
    }

    @Get('trends')
    @ApiOperation({ summary: 'Récupérer les tendances de recherche' })
    async getTrends(@Query() query: PeriodQueryDto): Promise<MarketTrend[]> {
        return this.marketService.getMarketTrends(query.period);
    }

    @Get('share')
    @ApiOperation({ summary: 'Récupérer les parts de marché' })
    async getShare(): Promise<MarketShare[]> {
        return this.marketService.getMarketShare();
    }

    @Get('prices')
    @ApiOperation({ summary: 'Récupérer les prix' })
    async getPrices(@Query() query: PeriodQueryDto): Promise<MarketPrice[]> {
        return this.marketService.getMarketPrices(query.period);
    }
}