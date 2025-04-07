import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from 'src/modules/common/abstract.schema';
import { User } from 'src/modules/users/users.module';

@Schema({ timestamps: true })
export class Song extends AbstractDocument {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  artist: string;

//   @Prop()
//   category: string; // e.g., "Worship", "Praise", "Hymn"
  @Prop({ required: true, type: Types.ObjectId, ref: 'Category' })  
  category: Types.ObjectId; // Reference to Category Schema

  @Prop({ default: 'Pending', enum: ['Pending', 'Approved', 'Postponed'] })
  status: string; // Admin approval system
  
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  uploadedBy: Types.ObjectId;
  
  // @Prop({ default: 'Not Assigned' })
  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  suggestedBy: Types.ObjectId;

  @Prop({ required: false })
  audioUrl: string; // Optional: link to an audio file

  @Prop({ required: false })
  sheetMusicUrl: string; // Optional: link to sheet music
  
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  approvedBy?: Types.ObjectId | User; // Admin who approved/rejected
}

export const SongSchema = SchemaFactory.createForClass(Song);
