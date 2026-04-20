import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Alert, AlertDocument } from './schemas/alert.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { WeatherService } from '../weather/weather.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(
    @InjectModel(Alert.name) private alertModel: Model<AlertDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private weatherService: WeatherService,
    private notificationService: NotificationService,
  ) {}

  // ✅ Runs every 30 minutes automatically
  @Cron(CronExpression.EVERY_30_MINUTES)
  async checkAllAlerts() {
    this.logger.log('🔍 Checking weather alerts...');

    const activeAlerts = await this.alertModel.find({ active: true });

    for (const alert of activeAlerts) {
      try {
        const weather = await this.weatherService.getWeather(alert.location);
        const user = await this.userModel.findById(alert.userId);
        if (!user) continue;

        const triggered = this.evaluateCondition(alert, weather);

        if (triggered) {
          const message = this.buildMessage(alert, weather);

          if (user.emailAlerts) {
            await this.notificationService.sendEmailAlert(user.email, alert.location, message);
          }
        }
      } catch (err) {
        this.logger.error(`Error checking alert ${alert._id}: ${err.message}`);
      }
    }
  }

  private evaluateCondition(alert: AlertDocument, weather: any): boolean {
    switch (alert.condition) {
      case 'temp_above':  return weather.temperature > alert.threshold;
      case 'temp_below':  return weather.temperature < alert.threshold;
      case 'rain':        return weather.isRaining;
      case 'storm':       return weather.isStormy;
      case 'humidity_above': return weather.humidity > alert.threshold;
      default: return false;
    }
  }

  private buildMessage(alert: AlertDocument, weather: any): string {
    const msgs = {
      temp_above: `🌡️ Temperature is ${weather.temperature}°C — above your ${alert.threshold}°C threshold`,
      temp_below: `🥶 Temperature is ${weather.temperature}°C — below your ${alert.threshold}°C threshold`,
      rain: `🌧️ It's currently raining in ${alert.location}: ${weather.description}`,
      storm: `⛈️ Thunderstorm detected in ${alert.location}! Stay safe!`,
      humidity_above: `💧 Humidity is ${weather.humidity}% — above your ${alert.threshold}% threshold`,
    };
    return msgs[alert.condition] || `Weather condition triggered in ${alert.location}`;
  }

  // CRUD operations
  async createAlert(userId: string, dto: any) {
    return this.alertModel.create({ ...dto, userId });
  }

  async getUserAlerts(userId: string) {
    return this.alertModel.find({ userId });
  }

  async deleteAlert(id: string, userId: string) {
    return this.alertModel.findOneAndDelete({ _id: id, userId });
  }
}