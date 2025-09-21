import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Cash } from '../cash/cash.entity';
import { Expense } from '../expense/expense.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cash, Expense])],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
