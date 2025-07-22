import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CashTransactionType } from './cash-transaction-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CashDto {
    @ApiProperty()
    @IsOptional()
    id: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @ApiProperty()
    @IsEnum(CashTransactionType)
    @IsNotEmpty()
    type: CashTransactionType;

    @ApiProperty()
    @IsString()
    @IsOptional()
    note?: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    cashById: number;
}
