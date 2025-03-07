import {IsString, IsOptional, IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { VoicePart } from '../interfaces/user.interface';

export class CreateUserFromAdminDto {
    
    @IsString()
    @IsOptional()
    name?: string;
  
    @IsEmail()
    @IsOptional()
    email?: string;
  
    @IsOptional()
    phone?: string;
  
    @IsString()
    @IsOptional()
    password?: string;

    @IsOptional()
    @IsString()
    address: string

    @IsString()
    @IsEnum(VoicePart)
    @IsOptional()
    voicePart?: string;
}

export class CreateUserDto {
    
    @IsNotEmpty()
    @IsString()
    name: string;
    
    @IsOptional()
    @IsEmail()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    phone: string;
  
    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsString()
    address: string

    @IsString()
    @IsOptional()
    @IsEnum(VoicePart)
    voicePart?: string;
}