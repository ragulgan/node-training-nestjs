import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserLoginDto {
    @IsNotEmpty()
    @ApiProperty({
      example: 'admin@gmail.com',
      required: true
    })
    readonly email: string;
  
    @IsNotEmpty()
    @ApiProperty({
      example: 'Test@123',
      required: true
    })
    readonly password: string;
  }

export class AdminDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'ajithkumar.shenll@gmail.com',
    required: false
  })
  readonly email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Test@123',
    required: false
  })
  readonly password: string;
}

export class CreateAdminDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'ajithkumar.shenll@gmail.com',
    required: true
  })
  readonly email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Test@123',
    required: true
  })
  readonly password: string;
}

export class SuperAdminChangePasswordDto {
  @IsNotEmpty()
  @ApiProperty({
    example: '662a033786eeaaaf4b7830f7',
    required: true
  })
  readonly adminId: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'ajith@123',
    required: true
  })
  readonly newPassword: string;
}