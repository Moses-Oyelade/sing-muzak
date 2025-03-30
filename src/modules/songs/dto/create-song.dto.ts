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
  
    @IsNotEmpty()
    @IsMongoId()
    suggestedBy: string;  // Should be a valid ObjectId
  }

export class SuggestSongDto {
    @IsOptional()
    @IsString()
    songId?: string; // For existing song
  
    @IsOptional()
    @IsString()
    title?: string; // For new song
  
    @IsOptional()
    @IsString()
    artist?: string; // For new song
  
    @IsString()
    suggestedBy: string; // User suggesting the song
  }
  