import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ExpenseType } from './expense-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ExpenseDto {
    @ApiProperty()
    @IsOptional()
    id: number;
    
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
    @IsNumber()
    @IsNotEmpty()
    recordedById: number; 
}
