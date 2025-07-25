import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsOptional, IsEmail, IsEnum, IsUrl } from 'class-validator';
import { UserRole, VoicePart } from '../interfaces/user.interface';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsUrl()
    profileImage: string;

    @IsOptional()
    @IsString()
    gender: string;

    @IsOptional()
    @IsString()
    instrument: string;
    
    @IsOptional()
    @IsString()
    address: string;

    @IsString()
    @IsEnum(VoicePart)
    @IsOptional()
    voicePart?: VoicePart;

    @IsString()
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;
}
