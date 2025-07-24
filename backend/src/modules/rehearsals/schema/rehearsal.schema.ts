import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RehearsalDocument = Rehearsal & Document;

@Schema({ timestamps: true })
export class Rehearsal {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true })
  location: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  attendees: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ default: '' })
  description?: string;
}

export const RehearsalSchema = SchemaFactory.createForClass(Rehearsal);

// ✅ Virtuals for Populated Data
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

// ✅ Ensure virtuals are included in output (this is important!)
RehearsalSchema.set('toObject', { virtuals: true });
RehearsalSchema.set('toJSON', { virtuals: true });
