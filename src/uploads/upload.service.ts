import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { File } from './file.schema';

@Injectable()
export class FileService {
  constructor(@InjectModel(File.name) private fileModel: Model<File>) {}

  async saveBase64File(base64File: string): Promise<string> {
    // Decode Base64 string
    const matches = base64File.match(/^data:(.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new BadRequestException('Invalid Base64 format');
    }

    const fileType = matches[1];
    const fileData = matches[2];
    const buffer = Buffer.from(fileData, 'base64');

    // Generate file name and path
    const fileExtension = this.getFileExtension(fileType);
    const fileName = `file-${Date.now()}.${fileExtension}`;
    const filePath = path.join(__dirname, '..', 'uploads', fileName);

    // Save the file to the server
    await fs.promises.writeFile(filePath, buffer);

    // Save file metadata to the database
    const fileRecord = new this.fileModel({
      filename: fileName,
      format: fileExtension,
      path: filePath,
    });
    await fileRecord.save();

    return filePath;
  }

  private getFileExtension(mimeType: string): string {
    switch (mimeType) {
      case 'image/jpeg':
        return 'jpg';
      case 'image/png':
        return 'png';
      case 'application/pdf':
        return 'pdf';
      default:
        throw new BadRequestException('Unsupported file type');
    }
  }
}
