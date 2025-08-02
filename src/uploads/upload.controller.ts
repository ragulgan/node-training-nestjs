import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { FileService } from './upload.service';
import { FileUploadDto } from './dto/file-upload.dto';
import { Validate } from 'class-validator';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  async uploadFile(@Body() fileUploadDto: FileUploadDto) {
    const { filename, format, file } = fileUploadDto;
    
    // Call the service to save the file
    const savedFilePath = await this.fileService.saveBase64File(file);
    
    return { message: 'File uploaded successfully', filePath: savedFilePath };
  }
}
