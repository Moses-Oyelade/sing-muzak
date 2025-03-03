import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SongDocument = Song & Document;

@Schema({ timestamps: true })
export class Song {
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

  @Prop({ required: true })
  uploadedBy: string;

  @Prop({ required: true })
  suggestedBy: string; // User who suggested the song

  @Prop()
  approvedBy?: string; // Admin who approved/rejected
}

export const SongSchema = SchemaFactory.createForClass(Song);
