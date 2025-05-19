import { Controller, Get, Post, Body, Delete, UseGuards } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';

@Controller('api')
@UseGuards(UserAuthGuard)
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) { }

  @Get('/alerts')
  getAllAlerts() {
    return this.alertsService.getAllAlerts();
  }

  @Post('/alerts/subscribe')
  subscribe(@Body() createAlertDto: CreateAlertDto) {
    return this.alertsService.subscribe(createAlertDto);
  }

  @Delete('/alerts/unsubscribe')
  unsubscribe(@Body() createAlertDto: CreateAlertDto) {
    return this.alertsService.unsubscribe(createAlertDto);
  }

  @Get('/regulations')
  getAllRegulations() {
    return this.alertsService.getAllRegulations();
  }
}
