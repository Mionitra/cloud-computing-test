import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService, WeatherData } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  // GET /weather?location=London
  @Get()
  async getWeather(
    @Query('location') location: string,
  ): Promise<WeatherData> {
    return this.weatherService.getWeather(location);
  }

  // GET /weather/multiple?locations=London,Paris,Berlin
  @Get('multiple')
  async getWeatherForMultiple(
    @Query('locations') locations: string,
  ): Promise<WeatherData[]> {
    const locationArray = locations.split(',').map(l => l.trim());
    return this.weatherService.getWeatherForLocations(locationArray);
  }
}
