import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { CrustUploadController } from './crust-upload.controller';
import { CrustUploadService } from './crust-upload.service';

@Module({
  imports: [
    MulterModule.register({
      limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB
    }),
  ],
  controllers: [CrustUploadController],
  providers: [CrustUploadService],
})
export class CrustUploadModule {}
