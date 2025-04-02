import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSongDto {
    @IsNotEmpty()
    @IsString()
    title: string;
  
    @IsNotEmpty()
    @IsString()
    artist: string;
  
    @IsNotEmpty()
    @IsMongoId()
    uploadedBy: string;  // Should be a valid ObjectId
  
    @IsOptional()
    @IsString()
    category: string
    
    @IsOptional()
    @IsString()
    audioUrl: string; // Optional: link to an audio file
    
    @IsOptional()
    @IsString()
    sheetMusicUrl: string;
  }

export class SuggestSongDto {
    
    @IsOptional()
    @IsString()
    title?: string; // For new song
    
    @IsOptional()
    @IsString()
    artist?: string; // For new song
    
    @IsString()
    suggestedBy: string; // User suggesting the song
    
    @IsOptional()
    @IsString()
    songId?: string; // For existing song
  }
  