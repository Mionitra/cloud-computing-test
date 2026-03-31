import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AlertDocument = Alert & Document;

@Schema({ timestamps: true })
export class Alert {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  condition: string; // "temp_above", "rain", "storm", etc.

  @Prop({ required: true })
  threshold: number; // e.g., 35 (°C)

  @Prop({ default: true })
  active: boolean;
}

export const AlertSchema = SchemaFactory.createForClass(Alert);