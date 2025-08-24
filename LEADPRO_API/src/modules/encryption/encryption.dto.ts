import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EncryptionKeyDto {
  @ApiProperty()
  @IsOptional()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  publicKey: string;
}

export class EncryptionDataDto {
  @ApiProperty()
  @IsOptional()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  storedEncryptionData: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  storedIV: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  storedEncryptionAESKey: string;
}
