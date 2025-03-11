import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';

@Controller('/api')
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

  @Delete('/alerts/regulations')
  getAllRegulations() {
    return this.alertsService.getAllRegulations();
  }
}
