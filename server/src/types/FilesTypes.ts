export interface UploadedFile {
  name?: string;
  data: Buffer;
  size: number;
  mimetype: string;
}
