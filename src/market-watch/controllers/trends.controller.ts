import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiOperation, ApiQuery } from "@nestjs/swagger";
import { TrendsService } from "../services/trends.service";

@Controller('api/veille/trends')
@ApiTags('Veille - Tendances')
export class TrendsController {
    constructor(private readonly trendsService: TrendsService) { }

    @Get()
    @ApiOperation({ summary: 'Obtenir les tendances du marché' })
    @ApiQuery({ name: 'region', required: false })
    async getMarketTrends(@Query('region') region = 'FR') {
        return this.trendsService.getTrends(region);
    }
}