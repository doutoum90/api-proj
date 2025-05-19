import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaticPage } from './entities/static-page.entity';
import { StaticPageService } from './services/static-page.service';
import { StaticPagesController } from './static-pages.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([StaticPage]),
    JwtModule,
    ConfigModule
  ],
  controllers: [StaticPagesController],
  providers: [StaticPageService],
  exports: [StaticPageService],
})
export class StaticPagesModule {} 