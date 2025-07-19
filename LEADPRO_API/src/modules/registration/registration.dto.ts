import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RegistrationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  @IsNotEmpty()
  @Type(() => Object)
  personalPhoto: Express.Multer.File;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  @IsNotEmpty()
  @Type(() => Object)
  nidPhoto: Express.Multer.File;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fatherName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  motherName: string;

  @ApiProperty({ enum: ['Single', 'Married', 'Divorced'] })
  @IsNotEmpty()
  @IsEnum(['Single', 'Married', 'Divorced'], { message: 'Invalid marital status' })
  maritalStatus: 'Single' | 'Married' | 'Divorced';

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  presentAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  permanentAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  profession: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nomineeName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  relationWithNominee: string;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  @IsNotEmpty()
  @Type(() => Object)
  nomineeNidPhoto: Express.Multer.File;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  confirmPassword: string;
}
