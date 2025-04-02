import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

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

  // @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [], autopopulate: true, required: true })  
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })  
  attendees: Types.ObjectId[]; // Stores user IDs of attendees

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })  
  createdBy: Types.ObjectId; // Admin who scheduled the rehearsal

  @Prop({ default: '' })
  description?: string; // Optional extra details
}

export const RehearsalSchema = SchemaFactory.createForClass(Rehearsal);

// Add Virtuals for Population (Optional)
RehearsalSchema.virtual('attendeeDetails', {
  ref: 'User',
  localField: 'attendees',
  foreignField: '_id',
  justOne: false,
});

RehearsalSchema.virtual('createdByDetails', {
  ref: 'User',
  localField: 'createdBy',
  foreignField: '_id',
  justOne: true,
});