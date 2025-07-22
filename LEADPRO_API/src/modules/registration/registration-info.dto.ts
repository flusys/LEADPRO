import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class ProfileInfoDto {
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
  @IsString()
  presentAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  permanentAddress: string;

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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comments?: string;

}
