import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

export type RehearsalDocument = Rehearsal & Document;

@Schema({ timestamps: true })
export class Rehearsal {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true })
  location: string;

  @Prop({ default: '' })
  agenda: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })  
  attendees: Types.ObjectId[]; // Stores user IDs of attendees

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })  
  createdBy: Types.ObjectId; // Admin who scheduled the rehearsal
}

export const RehearsalSchema = SchemaFactory.createForClass(Rehearsal);
