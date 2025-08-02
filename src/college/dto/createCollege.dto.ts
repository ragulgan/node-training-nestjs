import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { UserStatus } from 'src/libs/constants';

export class CreateCollegeDto {

  @ApiProperty({ example: 'Loyola College (Autonomous)' })
  @IsString()
  readonly collegeName: string;

  @ApiProperty({ example: 1059 })
  readonly code: number;

  @ApiProperty({ example: '24, 9, Nelson Manickam Rd, Nungambakkam, Chennai, Tamil Nadu 600034' })
  @IsString()
  readonly address: string;

  @ApiProperty({ example: 'admin@gmail.com' })
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email: string;

  @ApiProperty({ example: '044 2817 8200' })
  @IsPhoneNumber('IN', { message: 'Invalid mobile number' })
  readonly phone: string;

  @ApiProperty({ example: 'https://www.loyolacollege.edu/' })
  @IsString()
  readonly website: string;

  @ApiProperty({ example: '2011' })
  readonly established: string;

  @ApiProperty({ enum: ['ACTIVE', 'INACTIVE', 'DELETED']})
  @IsString()
  @IsNotEmpty({ message: 'Status should not be empty' })
  readonly status: UserStatus;
  
}
