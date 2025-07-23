import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { UtilsService } from '@flusys/flusysnest/shared/modules';
import { ApiService } from '@flusys/flusysnest/shared/apis';
import { FilterAndPaginationDto } from '@flusys/flusysnest/shared/dtos';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ExpenseDto } from './expense.dto';
import { Expense } from './expense.entity';
import { IExpense } from './expense.interface';
import { Cache } from "cache-manager";
import { User } from '@flusys/flusysnest/persistence/entities';

@Injectable()
export class ExpenseService extends ApiService<ExpenseDto, IExpense, Expense, Repository<Expense>> {

  constructor(
    @InjectRepository(Expense)
    protected readonly expenseRepository: Repository<Expense>,
    @Inject(CACHE_MANAGER) protected cacheManager: Cache,
    protected utilsService: UtilsService,
  ) {
    super(
      'expense',
      expenseRepository,
      cacheManager,
      utilsService,
    );
  }

  override async convertSingleDtoToEntity(dto: ExpenseDto): Promise<Expense> {
    let expense = new Expense();
    if (dto.id && dto.id > 0) {
      const dbData = await this.repository.findOne({
        where: { id: dto.id },
      });
      if (!dbData) {
        throw new NotFoundException(
          'No such entity data found for update! Please, Try Again.'
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
      }
    };
    return expense;
  }

  override getSelectQuery(query: SelectQueryBuilder<Expense>, select?: string[]): { query: SelectQueryBuilder<Expense>, cacheKey: string, isRaw: boolean } {
    if (!select || !select.length) {
      select = ['id', 'name', 'createdAt', 'deletedAt'];
    }
    const selectFields = select.map(field => `${this.entityName}.${field}`);

    selectFields.push("recordedBy.name");
    selectFields.push("recordedBy.id");
    query.leftJoinAndSelect("expense.recordedBy", "recordedBy");
    query.select(selectFields);
    const cacheKey = selectFields.join(',');
    return { query, cacheKey, isRaw: false };
  }


}
