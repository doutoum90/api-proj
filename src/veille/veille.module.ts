import { Module } from '@nestjs/common';
import { VeilleService } from './veille.service';
import { VeilleController } from './veille.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competitors } from './entities/competitor.entity';
import { Trends } from './entities/trends.entity';
import { News } from './entities/news.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Competitors, Trends, News])],
  controllers: [VeilleController],
  providers: [VeilleService],
  exports: [VeilleService],
})
export class VeilleModule {}
