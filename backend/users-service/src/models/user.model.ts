import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  name!: string;
  @Prop()
  lastName!: string;
  @Prop({ unique: true })
  email!: string;
  @Prop()
  password!: string;
  @Prop({ default: true })
  enabled!: boolean;
  @Prop({ default: false })
  protected!: boolean;
  @Prop()
  roleIds!: Types.ObjectId[];
  @Prop({ default: () => new Date() })
  createdAt!: Date;
  @Prop()
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
