import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadsModule } from './uploads/uploads.module';
import { CrustUploadModule } from './crust-upload/crust-upload.module';
import { CrustModule } from './crust/crust.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb+srv://test_cluster:test_cluster@cluster0.e2egqag.mongodb.net/?appName=Cluster0'),
    UploadsModule,
    CrustUploadModule,
    CrustModule,
  ],
})
export class AppModule {}
