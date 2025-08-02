// file-upload.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class FileUploadDto {
  @ApiProperty({
    description: 'The name of the file',
    example: 'myfile.jpg',
  })
  @IsNotEmpty()
  @IsString()
  filename: string;

  @ApiProperty({
    description: 'The format of the file (jpg, png, pdf)',
    example: 'jpg',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/(jpg|png|pdf)/, { message: 'File format must be jpg, png, or pdf' })
  format: string;

  @ApiProperty({
    description: 'Base64 encoded file string',
    example: 'data:image/jpeg;base64,/9j/4AAQSk...',
  })
  @IsNotEmpty()
  @IsString()
  file: string; // base64 string of the file
}
