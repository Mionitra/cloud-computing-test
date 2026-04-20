import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { Alert, AlertSchema } from './schemas/alert.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { WeatherModule } from 'src/weather/weather.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Alert.name, schema: AlertSchema },
      { name: User.name, schema: UserSchema },
    ]),
    WeatherModule,
    NotificationModule,
  ],
  controllers: [AlertsController],
  providers: [AlertsService],
})
export class AlertsModule {}
