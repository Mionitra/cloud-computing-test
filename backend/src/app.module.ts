import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './users/users.module';
import { AlertsModule } from './alerts/alerts.module';
import { WeatherService } from './weather/weather.service';
import { NotificationService } from './notification/notification.service';
import { AuthService } from './auth/auth.service';
import { WeatherController } from './weather/weather.controller';
import { WeatherModule } from './weather/weather.module';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URI ?? 'mongodb://localhost:27017/weather-alerts',
      }),
    }),
    ScheduleModule.forRoot(), // enables cron jobs
    AuthModule,
    UsersModule,
    WeatherModule,
    NotificationModule,
    AlertsModule,
  ],
  providers: [WeatherService, NotificationService, AuthService],
  controllers: [WeatherController],
})
export class AppModule {}
