import { IsString, IsNumber, IsOptional, IsIn } from 'class-validator';

export class CreateAlertDto {
  @IsString()
  location: string;

  @IsIn([
    'temp_above',
    'temp_below',
    'rain',
    'storm',
    'humidity_above',
  ])
  condition: string;

  @IsOptional()
  @IsNumber()
  threshold?: number;
}