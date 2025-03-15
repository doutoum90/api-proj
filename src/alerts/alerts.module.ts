import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alert } from './entities/alert.entity';
import { Regulation } from './entities/regulation.entity';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [TypeOrmModule.forFeature([Alert, Regulation])],
  controllers: [AlertsController],
  providers: [AlertsService, JwtService],
  exports: [AlertsService],
})
export class AlertsModule { }

