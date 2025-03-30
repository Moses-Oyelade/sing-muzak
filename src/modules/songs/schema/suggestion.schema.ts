import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SuggestionDocument = Suggestion & Document;

@Schema({ timestamps: true })
export class Suggestion {
  @Prop({ type: Types.ObjectId, ref: 'Song', required: true })
  song: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  suggestedBy: Types.ObjectId;
}

export const SuggestionSchema = SchemaFactory.createForClass(Suggestion);
