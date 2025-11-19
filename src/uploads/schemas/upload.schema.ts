import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UploadDocument = Upload & Document;

@Schema({ timestamps: true })
export class Upload {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  cid: string;

  @Prop()
  size?: number;

  @Prop()
  mimeType?: string;

  @Prop()
  url?: string;

  @Prop({ type: Object })
  metadata?: any;   // <-- FIXED
}

export const UploadSchema = SchemaFactory.createForClass(Upload);
