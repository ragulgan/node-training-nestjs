import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { UserStatus } from '../libs/constants';
const bcrypt = require('bcrypt')

@Schema({ toJSON: { versionKey: false }, toObject: { versionKey: false }, timestamps: true })
export class User extends Document {

  @Prop({ required: true, unique: true })
  userName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  userMobile: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Role' })
  role: string;

  @Prop({trim: true})
  password: string;

  @Prop({
    type: String,
    required: true,
    enum: UserStatus,
    default: UserStatus.ACTIVE
  })
  status: UserStatus;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
  }
  next();
});

UserSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate() as any;
  if (update.password) {
    update.password = bcrypt.hashSync(update.password, bcrypt.genSaltSync(8));
  }
  next();
});

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});