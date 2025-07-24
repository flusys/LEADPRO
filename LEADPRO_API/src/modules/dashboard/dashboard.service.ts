import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IDashboard, IUserCashSummary } from './dashboard.interface';
import { ILoggedUserInfo } from '@flusys/flusysnest/shared/interfaces';
import { Cash } from '../cash/cash.entity';
import { Expense } from '../expense/expense.entity';
@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Cash)
    private readonly cashRepository: Repository<Cash>,

    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) { }

  async getDashboardData(user: ILoggedUserInfo): Promise<IDashboard> {
    // ➤ Total Cash Amount
    const totalCashResult = await this.cashRepository
      .createQueryBuilder('cash')
      .select('COALESCE(SUM(cash.amount), 0)', 'totalCashAmount')
      .getRawOne();

    // ➤ Last Month Date Range
    const now = new Date();
    const firstDayOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const lastMonthCashResult = await this.cashRepository
      .createQueryBuilder('cash')
      .where('cash.date >= :start AND cash.date < :end', {
        start: firstDayOfThisMonth.toISOString(),
        end: firstDayOfNextMonth.toISOString(),
      })
      .select('COALESCE(SUM(cash.amount), 0)', 'lastMonthCashAmount')
      .getRawOne();

    // ➤ Total Expense
    const totalExpenseResult = await this.expenseRepository
      .createQueryBuilder('expense')
      .select('COALESCE(SUM(expense.amount), 0)', 'totalExpense')
      .getRawOne();

    return {
      totalCashAmount: Number(totalCashResult.totalCashAmount),
      lastMonthCashAmount: Number(lastMonthCashResult.lastMonthCashAmount),
      totalExpense: Number(totalExpenseResult.totalExpense),
    };
  }

  async getUserWiseCash(): Promise<IUserCashSummary[]> {
    const result = await this.cashRepository
      .createQueryBuilder('cash')
      .innerJoin('cash.cashBy', 'user')
      .innerJoin('user.profilePicture', 'profilePicture')
      .select('user.id', 'userId')
      .addSelect('user.name', 'userName')
      .addSelect('profilePicture.url', 'userImage')
      .addSelect('COALESCE(SUM(cash.amount), 0)', 'cashAmount')
      .groupBy('user.id')
      .addGroupBy('user.name')
      .addGroupBy('profilePicture.url')
      .getRawMany();

    return result.map(row => ({
      userId: row.userId,
      userName: row.userName,
      userImage: row.userImage,
      cashAmount: Number(row.cashAmount),
    }));
  }

}
