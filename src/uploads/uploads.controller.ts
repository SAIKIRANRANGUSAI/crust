import { Controller, Post, Get, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import * as multer from 'multer';

function memoryStorage() {
  return multer.memoryStorage();
}

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.createAndSave(file);
  }

  @Get()
  async list() {
    return this.uploadsService.findAll();
  }
}
