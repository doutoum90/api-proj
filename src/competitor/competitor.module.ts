import { Module } from '@nestjs/common';
import { CompetitorService } from './competitor.service';
import { CompetitorController } from './competitor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competitor } from 'src/financial/entities/competitor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Competitor])],
  controllers: [CompetitorController],
  providers: [CompetitorService],
  exports: [CompetitorService],
})
export class CompetitorModule {}
