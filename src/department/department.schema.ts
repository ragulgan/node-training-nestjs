import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({ toJSON: { virtuals: true }, timestamps: true })
export class Department extends mongoose.Document {

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  abbreviation: string;

  @Prop()
  shortDescription: string;

  @Prop({ enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' })
  status: string;

}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
DepartmentSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});