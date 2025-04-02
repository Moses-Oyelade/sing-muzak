import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Announcement extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: new Date() })
  publishedAt: Date;
}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);
