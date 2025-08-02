import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({ toJSON: { virtuals: true }, timestamps: true })
export class College extends mongoose.Document {

  @Prop({ required: true, unique: true })
  collegeName: string;

  @Prop({ required: true, default: 0 })
  code: number;

  @Prop({ required: true, unique: true })
  address: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop()
  website: string;

  @Prop({ required: true })
  established: string;

  @Prop({ enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' })
  status: string;

}

export const CollegeSchema = SchemaFactory.createForClass(College);
CollegeSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});