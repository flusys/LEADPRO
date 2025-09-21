import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashController } from './cash.controller';
import { Cash } from './cash.entity';
import { CashService } from './cash.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cash])],
  controllers: [CashController],
  providers: [CashService],
})
export class CashModule {}
