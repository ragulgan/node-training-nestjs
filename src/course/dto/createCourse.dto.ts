import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserStatus } from 'src/libs/constants';

export class CreateCourseDto {
  @ApiProperty({ example: '6639d814e00d110fc099900b' })
  @IsString()
  readonly userId: string;

  @ApiProperty({ example: 'BE' })
  @IsString()
  readonly name: string;

  @ApiProperty({ example: 'Bachelor of engineering' })
  @IsString()
  readonly abbreviation: string;

  @ApiProperty({ example: 'Bachelor degree in engineering' })
  readonly shortDescription: string;

  @ApiProperty({ enum: ['ACTIVE', 'INACTIVE', 'DELETED']})
  readonly status: UserStatus;
}