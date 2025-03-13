import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { CompetitorsService } from './services/competitors.service';
import { ApiOperation } from '@nestjs/swagger';
import { AddCompetitorDto } from './dto/add-competitor.dto';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Veille - Concurrents')
@Controller('api/veille/competitors')
export class CompetitorsController {
    constructor(private readonly competitorsService: CompetitorsService) { }

    @Get()
    @ApiOperation({ summary: 'Liste des concurrents surveillés' })
    async getCompetitors() {
        return this.competitorsService.findAll();
    }

    @Post('add')
    @ApiOperation({ summary: 'Ajouter un nouveau concurrent' })
    async addCompetitor(@Body() dto: AddCompetitorDto) {
        return this.competitorsService.create(dto);
    }

    @Delete('remove/:id')
    @ApiOperation({ summary: 'Supprimer un concurrent' })
    async removeCompetitor(@Param('id') id: string) {
        return this.competitorsService.remove(id);
    }
}
