import { IsString, IsIn } from 'class-validator';

export class UpdateSongStatusDto {
  @IsString()
  @IsIn(['Pending', 'Approved', 'Postponed'])
  status: string;
}
