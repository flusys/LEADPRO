import { Module } from '@nestjs/common';
import { CashController } from './cash.controller';
import { CashService } from './cash.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cash } from './cash.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cash
    ]),
  ],
  controllers: [CashController],
  providers: [CashService],
})
export class CashModule { }
