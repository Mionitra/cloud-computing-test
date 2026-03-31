import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface WeatherData {
  location: string;
  temperature: number;  // Celsius
  feelsLike: number;
  humidity: number;
  description: string;
  windSpeed: number;
  isRaining: boolean;
  isStormy: boolean;
}

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(private config: ConfigService) {
    this.apiKey = this.config.getOrThrow<string>('OPENWEATHER_API_KEY');
  }

  async getWeather(location: string): Promise<WeatherData> {
    try {
      const { data } = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          q: location,
          appid: this.apiKey,
          units: 'metric', // Celsius
        },
      });

      return {
        location: data.name,
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        description: data.weather[0].description,
        windSpeed: data.wind.speed,
        isRaining: data.weather[0].main === 'Rain',
        isStormy: data.weather[0].main === 'Thunderstorm',
      };
    } catch (error) {
      this.logger.error(`Failed to fetch weather for ${location}`, error.message);
      throw error;
    }
  }

  // Fetch weather for multiple locations at once
  async getWeatherForLocations(locations: string[]): Promise<WeatherData[]> {
    const results = await Promise.allSettled(
      locations.map(loc => this.getWeather(loc))
    );

    return results
      .filter(r => r.status === 'fulfilled')
      .map(r => (r as PromiseFulfilledResult<WeatherData>).value);
  }
}