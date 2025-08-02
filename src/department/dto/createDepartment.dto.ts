import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserStatus } from 'src/libs/constants';

export class CreateDepartmentDto {
  @ApiProperty({ example: 'CSE' })
  @IsString()
  readonly name: string;

  @ApiProperty({ example: 'Computer Science Engineering' })
  @IsString()
  readonly abbreviation: string;

  @ApiProperty({ example: 'Engineering degree on Computer Science' })
  readonly shortDescription: string;

  @ApiProperty({ enum: ['ACTIVE', 'INACTIVE', 'DELETED']})
  @IsString()
  @IsNotEmpty({ message: 'Status should not be empty' })
  readonly status: UserStatus;
}