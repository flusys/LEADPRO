import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ExpenseType } from './expense-type.enum';

export class ExpenseDto {
  @ApiProperty()
  @IsOptional()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsEnum(ExpenseType)
  @IsOptional()
  type: ExpenseType = ExpenseType.VARIABLE;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  recordedById: string;
}
