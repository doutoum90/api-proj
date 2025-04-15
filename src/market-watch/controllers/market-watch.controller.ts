import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { MarketWatchService } from '../services/market-watch.service';
import { AddCompetitorDto } from '../dto/add-competitor.dto';
import { AddCompetitorDataSourceDto } from '../dto/add-competitor-data-source.dto';
import { AddCompetitorKPIDto } from '../dto/add-competitor-kpi.dto';

@Controller('api/market-watch')
export class MarketWatchController {
  constructor(private readonly marketWatchService: MarketWatchService) {}

  @Post('competitors')
  createCompetitor(@Body() createMarketWatchDto: AddCompetitorDto) {
    return this.marketWatchService.create(createMarketWatchDto);
  }

  @Get('competitors')
  findAllCompetitors() {
    return this.marketWatchService.findAll();
  }

  @Get('competitors/:id')
  findOneCompetitor(@Param('id') id: string) {
    return this.marketWatchService.findOne(id);
  }

  @Delete('competitors/:id')
  removeCompetitor(@Param('id') id: string) {
    return this.marketWatchService.remove(id);
  }

  @Post('competitors/:id/data-sources')
  addDataSource(
    @Param('id') id: string,
    @Body() dataSourceDto: AddCompetitorDataSourceDto,
  ) {
    return this.marketWatchService.addDataSource(id, dataSourceDto);
  }

  @Put('competitors/:id/data-sources/:sourceId')
  updateDataSource(
    @Param('id') id: string,
    @Param('sourceId') sourceId: string,
    @Body() dataSourceDto: AddCompetitorDataSourceDto,
  ) {
    return this.marketWatchService.updateDataSource(id, sourceId, dataSourceDto);
  }

  @Delete('competitors/:id/data-sources/:sourceId')
  removeDataSource(
    @Param('id') id: string,
    @Param('sourceId') sourceId: string,
  ) {
    return this.marketWatchService.removeDataSource(id, sourceId);
  }

  @Post('competitors/:id/kpis')
  addKPI(
    @Param('id') id: string,
    @Body() kpiDto: AddCompetitorKPIDto,
  ) {
    return this.marketWatchService.addKPI(id, kpiDto);
  }

  @Delete('competitors/:id/kpis/:kpiId')
  removeKPI(
    @Param('id') id: string,
    @Param('kpiId') kpiId: string,
  ) {
    return this.marketWatchService.removeKPI(id, kpiId);
  }

  @Get('trends')
  getMarketTrends(@Query('period') period: string = 'daily') {
    return this.marketWatchService.getMarketTrends(period);
  }

  @Get('shares')
  getMarketShare() {
    return this.marketWatchService.getMarketShare();
  }

  @Get('prices')
  getMarketPrices(@Query('period') period: string = 'daily') {
    return this.marketWatchService.getMarketPrices(period);
  }
}
