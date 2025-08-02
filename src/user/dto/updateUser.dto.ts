
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserStatus } from 'src/libs/constants';

export class UpdatedUserDto {
  @ApiProperty({ example: 'Ragul R' })
  @IsString()
  readonly userName: string;

  @ApiProperty({
    example: 'admin@gmail.com',
    required: true,
  })
  @IsEmail({}, { message: 'email must be a valid email address' })
  readonly email: string;

  @ApiProperty({ example: '+91 9789391155' })
  @IsString()
  readonly userMobile: string;

  @ApiProperty({ example: '66ed4e2f55d5a721144bcb1d', description: 'Role ID associated with the product' })
  role: string;

  @ApiProperty({
    example: 'Test@123',
    required: true,
  })
  @IsString({ message: 'password should be a string' })
  @MinLength(6, { message: 'password must be at least 6 characters long' })
  @IsNotEmpty({ message: 'password should not be empty' })
  readonly password: string;
  
  @ApiProperty({ enum: ['ACTIVE', 'INACTIVE', 'DELETED']})
  readonly status: UserStatus;
}