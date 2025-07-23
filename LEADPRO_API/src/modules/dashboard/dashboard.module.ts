import { Module } from '@nestjs/common';

import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cash } from '../cash/cash.entity';
import { Expense } from '../expense/expense.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cash,
      Expense
    ]),
  ],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule { }
