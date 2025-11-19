import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import FormData from 'form-data';
import { Upload, UploadDocument } from './schemas/upload.schema';

@Injectable()
export class UploadsService {
  constructor(
    @InjectModel(Upload.name)
    private uploadModel: Model<UploadDocument>,
  ) {}

  async uploadToCrust(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided');

    // Prepare form-data
    const form = new FormData();
    form.append('file', file.buffer, file.originalname);

    const gateway = 'https://gw.crustfiles.app'; // https://gw.crustfiles.app
    const addUrl = `${gateway}/api/v0/add`;

    // ----------- 1) Upload to Crust Gateway --------------
    const resp = await axios.post(addUrl, form, {
      headers: {
        ...form.getHeaders(),
        Authorization:
          'Bearer c3Vic3RyYXRlLWNUTDFQRjd4dllkOHhBQzVGWkVxWWtpRmNGVFRReFoxTXY5YXBqSGJaZzZwUDVaV046MHhlYzIxNDM0YWFiZjI5NjBlNjAzOGQ4ZjVhMDU5YTVkYjMzODkyZDE0YTEzODE1NWMyMTA0YWJjMGI0MmM0MzRjZTZkZDFjMWQ4NzVlNDgzYjkyMmEzYzhhNWFmMWUyMjJhNWQ0MDE4MGZlODJlZmE2Y2Q5MGRlZWQyY2NhMTA4NQ==',
      },
    });

    const data = resp.data;
    const cid = data.Hash || data.cid;

    if (!cid) {
      throw new Error('Crust gateway did not return a CID: ' + JSON.stringify(data));
    }

    const url = `${gateway}/ipfs/${cid}`;

    // ----------- 2) Optional — Pin to Crust Pinning Service --------------
    const pinService = 'https://pin.crustcode.com/psa'; // e.g., https://pin.crustcode.com/psa

    if (pinService) {
      const pinUrl = `${pinService}/pins`;

      try {
        await axios.post(
          pinUrl,
          {
            cid,
            name: file.originalname,
            origins: [url],
          },
          {
            headers: {
              'Content-Type': 'application/json',
              // If pin service requires same access token, add it here
              Authorization:
                'Bearer c3Vic3RyYXRlLWNUTDFQRjd4dllkOHhBQzVGWkVxWWtpRmNGVFRReFoxTXY5YXBqSGJaZzZwUDVaV046MHhlYzIxNDM0YWFiZjI5NjBlNjAzOGQ4ZjVhMDU5YTVkYjMzODkyZDE0YTEzODE1NWMyMTA0YWJjMGI0MmM0MzRjZTZkZDFjMWQ4NzVlNDgzYjkyMmEzYzhhNWFmMWUyMjJhNWQ0MDE4MGZlODJlZmE2Y2Q5MGRlZWQyY2NhMTA4NQ==',
            },
          },
        );
      } catch (err) {
        console.error('Pinning failed:', err.response?.data || err.message);
      }
    }

    return {
      cid,
      url,
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  async createAndSave(file: Express.Multer.File) {
    const result = await this.uploadToCrust(file);

    return this.uploadModel.create({
      filename: file.originalname,
      cid: result.cid,
      url: result.url,
      size: result.size,
      mimeType: result.mimeType,
    });
  }

  async findAll() {
    return this.uploadModel.find().sort({ createdAt: -1 }).lean();
  }
}
