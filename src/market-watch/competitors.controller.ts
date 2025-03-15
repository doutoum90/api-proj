import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AddCompetitorDto } from './dto/add-competitor.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MarketWatchService } from './services/market-watch.service';

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
}
