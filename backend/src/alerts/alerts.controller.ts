import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  // Create alert
  @Post()
  async createAlert(@Body() dto: CreateAlertDto, @Req() req) {
    // assuming you have auth middleware that adds user to req
    const userId = req.user.id;
    return this.alertsService.createAlert(userId, dto);
  }

  // Get all alerts for logged-in user
  @Get()
  async getUserAlerts(@Req() req) {
    const userId = req.user.id;
    return this.alertsService.getUserAlerts(userId);
  }

  // Delete alert
  @Delete(':id')
  async deleteAlert(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    return this.alertsService.deleteAlert(id, userId);
  }
}