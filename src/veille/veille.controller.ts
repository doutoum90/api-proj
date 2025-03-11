import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { VeilleService } from './veille.service';
import { CreateCompetitorDto } from './dto/create-competitor.dto';
@Controller('api/veille')
export class VeilleController {
  constructor(private readonly veilleService: VeilleService) {}

  
  @Get('/competitors')
  findAll() {
    return this.veilleService.getAllCompetitors();
  }
  @Post('/competitors/add')
  addCompetitor(@Body() createCompetitorDto: CreateCompetitorDto) {
    return this.veilleService.addCompetitor(createCompetitorDto);
  }

  @Delete('/competitors/remove/:id')
  remove(@Param('id') id: string) {
    return this.veilleService.removeCompetitor(+id);
  }

  @Get('/trends')
  getAllTrends() {
    return this.veilleService.getAllTrends();
  }

  @Get('/news')
  getAllNews() {
    return this.veilleService.getAllNews();
  }

}
