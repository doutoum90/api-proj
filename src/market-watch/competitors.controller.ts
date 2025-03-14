import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { CompetitorsService } from './services/competitors.service';
import { ApiOperation } from '@nestjs/swagger';
import { AddCompetitorDto } from './dto/add-competitor.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MarketWatchService } from './services/market-watch.service';

@ApiTags('Veille - Concurrents')
@Controller('api/veille/competitors')
export class CompetitorsController {

    constructor(private readonly marketService: MarketWatchService) { }
    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Liste des concurrents surveillés' })
    async getCompetitors() {
        console.log('getCompetitors');
        return this.marketService.findAll();
    }

    @Post('add')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Ajouter un nouveau concurrent' })
    async addCompetitor(@Body() dto: AddCompetitorDto) {
        return this.marketService.create(dto);
    }

    @Delete('remove/:id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Supprimer un concurrent' })
    async removeCompetitor(@Param('id') id: string) {
        return this.marketService.remove(id);
    }
}
