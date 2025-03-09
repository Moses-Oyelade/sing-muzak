import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsOptional, IsEmail, IsEnum } from 'class-validator';
import { VoicePart } from '../interfaces/user.interface';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsString()
    firstName: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    profileImage: string;
    
    @IsOptional()
    @IsString()
    address: string;

    @IsString()
    @IsEnum(VoicePart)
    @IsOptional()
    voicePart?: VoicePart;
}
