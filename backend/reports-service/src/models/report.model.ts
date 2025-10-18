import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReportDocument = Report & Document;

@Schema()
export class Report extends Document {
  @Prop()
  name!: string;

  @Prop()
  description!: string;

  @Prop()
  city!: string;

  @Prop()
  state!: string;

  @Prop()
  country!: string;

  @Prop()
  address!: string;

  @Prop()
  latitude!: number;

  @Prop()
  longitude!: number;

  @Prop()
  images!: { name: string; url: string }[];

  @Prop()
  status!: string;

  @Prop()
  comments!: { author: string; message: string; createdAt: Date }[];

  @Prop()
  userId!: Types.ObjectId;

  @Prop({ default: () => new Date() })
  createdAt!: Date;

  @Prop()
  updatedAt?: Date;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
