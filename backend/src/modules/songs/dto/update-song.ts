import { IsOptional, IsString, IsIn, IsMongoId, IsEnum, IsUrl } from 'class-validator';

export class UpdateSongStatusDto {
  @IsString()
  @IsIn(['Pending', 'Approved', 'Postponed'])
  status: string;
}

// dto/update-song.dto.ts
export class UpdateSongDto {
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
  @IsUrl()
  audioUrl?: string;

  @IsOptional()
  @IsUrl()
  pdfUrl?: string;

  @IsOptional()
  @IsMongoId()
  uploadedBy?: string;

  @IsOptional()
  @IsMongoId()
  suggestedBy?: string;
}
