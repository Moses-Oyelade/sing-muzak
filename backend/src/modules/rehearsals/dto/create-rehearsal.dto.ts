// src/modules/rehearsals/dto/create-rehearsal.dto.ts
import { IsNotEmpty, IsString, IsDateString, IsMongoId, IsOptional, IsArray } from 'class-validator';

export class CreateRehearsalDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsString()
  time: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  attendees?: string[];

  @IsOptional()
  @IsString()
  description?: string;
}
