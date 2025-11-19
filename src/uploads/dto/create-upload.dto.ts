export class CreateUploadDto {
  filename: string;
  cid: string;
  size?: number;
  mimeType?: string;
  url?: string;
  metadata?: any;
}
