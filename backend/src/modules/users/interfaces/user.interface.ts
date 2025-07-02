export enum UserRole {
    ADMIN = 'admin',
    MEMBER = 'member',
}

export enum VoicePart {
    SOPRANO = 'soprano',
    ALTO = 'alto',
    TENOR = 'tenor',
    BASS = 'bass',
    PENDING = 'pending'
}

export interface User {
    name: string;
    email: string;
    phone: string;
    password: string;
    profileImagine?: string;
    gender?: string;
    instrument?: string;
    address: string;
    role: UserRole;
    voicePart: VoicePart;
    createdAt?: Date;
    updatedAt?: Date;
}