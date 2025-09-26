import { User } from '@flusys/flusysnest/persistence/entities';
import { ApiService, HybridCache } from '@flusys/flusysnest/shared/classes';
import { ILoggedUserInfo } from '@flusys/flusysnest/shared/interfaces';
import { UtilsService } from '@flusys/flusysnest/shared/modules';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ExpenseDto } from './expense.dto';
import { Expense } from './expense.entity';
import { IExpense } from './expense.interface';

@Injectable()
export class ExpenseService extends ApiService<
  ExpenseDto,
  IExpense,
  Expense,
  Repository<Expense>
> {
  constructor(
    @InjectRepository(Expense)
    protected readonly expenseRepository: Repository<Expense>,
    @Inject('CACHE_INSTANCE') protected cacheManager: HybridCache,
    protected utilsService: UtilsService,
  ) {
    super(
      'expense',
      expenseRepository,
      cacheManager,
      utilsService,
      ExpenseService.name,
    );
  }

  override async convertSingleDtoToEntity(
    dto: ExpenseDto,
    user: ILoggedUserInfo,
  ): Promise<Expense> {
    let expense = new Expense();
    if (dto.id && dto.id && dto.id != '') {
      const dbData = await this.repository.findOne({
        where: { id: dto.id },
      });
      if (!dbData) {
        throw new NotFoundException(
          'No such entity data found for update! Please, Try Again.',
        );
      }
      expense = dbData;
    }
    expense = {
      ...expense,
      ...dto,
      ...{
        date: new Date(),
        recordedBy: { id: dto.recordedById } as User,
      },
    };
    return expense;
  }

  override async getSelectQuery(
    query: SelectQueryBuilder<Expense>,
    user: ILoggedUserInfo,
    select?: string[],
  ) {
    if (!select || !select.length) {
      select = ['id', 'name', 'createdAt', 'deletedAt'];
    }
    const selectFields = select.map((field) => `${this.entityName}.${field}`);

    selectFields.push('recordedBy.name');
    selectFields.push('recordedBy.id');
    query.leftJoinAndSelect('expense.recordedBy', 'recordedBy');
    query.select(selectFields);
    const cacheKey = selectFields.join(',');
    return { query, cacheKey, isRaw: false };
  }
}
