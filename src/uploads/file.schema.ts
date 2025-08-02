import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ toJSON: { versionKey: false }, toObject: { versionKey: false }, timestamps: true })
export class File extends Document {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  format: string;

  @Prop({ required: true })
  path: string;

  @Prop({ default: Date.now })
  uploadedAt: Date;
}

export const FileSchema = SchemaFactory.createForClass(File);
FileSchema.set('toJSON', {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    },
  });

