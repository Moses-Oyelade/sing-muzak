// dto/base-song.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class BaseSongDto {
  @IsString()
  title: string;

  @IsString()
  artist: string;

  @IsString()
  category: string;
}
