import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from 'src/modules/common/abstract.schema';

@Schema({ timestamps: true })
export class Song extends AbstractDocument {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  artist: string;

//   @Prop()
//   category: string; // e.g., "Worship", "Praise", "Hymn"
  @Prop({ required: true, ref: 'Category' })  
  category: string; // Reference to Category Schema

  @Prop()
  audioUrl: string; // Optional: link to an audio file

  @Prop()
  sheetMusicUrl: string; // Optional: link to sheet music

  @Prop({ default: 'Pending', enum: ['Pending', 'Approved', 'Postponed'] })
  status: string; // Admin approval system

  // @Prop({ required: true })
  // uploadedBy: string;

  // @Prop({ required: true })
  // suggestedBy: string; // User who suggested the song

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  uploadedBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  suggestedBy: Types.ObjectId;


  @Prop()
  approvedBy?: string; // Admin who approved/rejected
}

export const SongSchema = SchemaFactory.createForClass(Song);
