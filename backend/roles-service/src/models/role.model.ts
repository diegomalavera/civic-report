import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema()
export class Role extends Document {
  @Prop()
  name!: string;

  @Prop({ unique: true })
  code!: string;

  @Prop()
  description!: string;

  @Prop({ type: [String], default: [] })
  permissions!: string[];

  @Prop({ default: true })
  enabled!: boolean;

  @Prop({ default: false })
  protected!: boolean;

  @Prop({ default: () => new Date() })
  createdAt!: Date;

  @Prop()
  updatedAt?: Date;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
