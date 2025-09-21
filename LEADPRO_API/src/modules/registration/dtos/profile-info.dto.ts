import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum MaritalStatusEnum {
  Single = 'Single',
  Married = 'Married',
  Divorced = 'Divorced',
}

export class ProfileInfoDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the father',
  })
  @IsNotEmpty()
  @IsString()
  fatherName: string;

  @ApiProperty({
    example: 'Jane Doe',
    description: 'Full name of the mother',
  })
  @IsNotEmpty()
  @IsString()
  motherName: string;

  @ApiProperty({
    enum: MaritalStatusEnum,
    example: MaritalStatusEnum.Single,
    description: 'Marital status of the individual',
  })
  @IsNotEmpty()
  @IsEnum(MaritalStatusEnum, { message: 'Invalid marital status' })
  maritalStatus: MaritalStatusEnum;

  @ApiProperty({
    example: '123 Main St, Dhaka',
    description: 'Current residential address',
  })
  @IsNotEmpty()
  @IsString()
  presentAddress: string;

  @ApiProperty({
    example: '456 Permanent Rd, Chattogram',
    description: 'Permanent home address',
  })
  @IsNotEmpty()
  @IsString()
  permanentAddress: string;

  @ApiProperty({
    example: 'Software Engineer',
    description: 'Profession of the individual',
  })
  @IsNotEmpty()
  @IsString()
  profession: string;

  @ApiProperty({
    example: 'Rahim Uddin',
    description: 'Name of the nominee for records',
  })
  @IsNotEmpty()
  @IsString()
  nomineeName: string;

  @ApiProperty({
    example: 'Brother',
    description: 'Relationship with the nominee',
  })
  @IsNotEmpty()
  @IsString()
  relationWithNominee: string;

  @ApiProperty({
    required: false,
    example: 'Special notes about the profile',
    description: 'Optional comments or notes',
  })
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiProperty({
    required: false,
    example: 'Special notes about the profile',
    description: 'Optional comments or notes',
  })
  @IsOptional()
  @IsString()
  referUserId?: string;
}
