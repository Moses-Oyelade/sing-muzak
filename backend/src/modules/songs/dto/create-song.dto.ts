import { BaseSongDto } from "./base-song.dto";
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSongDto extends BaseSongDto {
    
    @IsOptional()
    @IsString()
    audioUrl: string; // Optional: link to an audio file
    
    @IsOptional()
    @IsString()
    pdfUrl: string;
  
    @IsNotEmpty()
    @IsMongoId()
    uploadedBy: string;  // Should be a valid ObjectId
  
    @IsOptional()
    @IsMongoId({ message: 'suggestedBy must be a valid MongoDB ObjectId' })
    suggestedBy?: string;
    
  }

export class SuggestSongDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    artist?: string;

    @IsOptional()
    @IsString()
    category?: string; 
    
    @IsOptional()
    @IsMongoId({ message: 'suggestedBy must be a valid MongoDB ObjectId' })
    suggestedBy: string; // User suggesting the song
    
    @IsOptional()
    @IsString()
    songId?: string; // For existing song
  }
  