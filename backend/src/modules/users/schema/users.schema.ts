import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { UserRole, VoicePart } from '../interfaces/user.interface';
import { AbstractDocument } from 'src/modules/common/abstract.schema';

  
  @Schema({ timestamps: true })
  export class User extends AbstractDocument{
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, unique: true })
    email: string;
    
    @Prop({ type: String, required: true, unique: true })
    phone: string;

    @Prop({ type: String, required: true })
    password: string;

    @Prop({ type: String, required: false })
    address: string;

    @Prop({ type: String, enum: UserRole, default: UserRole.MEMBER })
    role: UserRole;

    @Prop({ type: String, enum: VoicePart, default: VoicePart.PENDING , required: false })
    voicePart: VoicePart;

    @Prop({ nullable: true })
    refreshToken?: string;

    async validatePassword(password: string): Promise<boolean> {
      return bcrypt.compare(password, this.password);
    }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});
