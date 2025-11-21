import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CrustUploadService } from './crust-upload.service';

@Controller('crust-upload')
export class CrustUploadController {
  constructor(private readonly crustService: CrustUploadService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return this.crustService.uploadToCrust(file);
  }
}
