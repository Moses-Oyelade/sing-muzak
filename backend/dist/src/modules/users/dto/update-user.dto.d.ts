import { CreateUserDto } from './create-user.dto';
import { VoicePart } from '../interfaces/user.interface';
declare const UpdateUserDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateUserDto>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
    name: string;
    email: string;
    profileImage: string;
    address: string;
    voicePart?: VoicePart;
}
export {};
