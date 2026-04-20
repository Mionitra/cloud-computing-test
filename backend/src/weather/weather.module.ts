import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

@Module({
  imports: [
    // MongooseModule.forFeature([
    //       { name: Weather.name, schema: WeatherSchema },
    // ]),
  ],
  controllers: [WeatherController],
  providers: [WeatherService],
  exports: [WeatherService], // export WeatherService for use in AlertsModule
})
export class WeatherModule {}
