import { User } from '@flusys/flusysnest/persistence/entities';
import { ApiService, HybridCache } from '@flusys/flusysnest/shared/classes';
import { UtilsService } from '@flusys/flusysnest/shared/modules';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CashDto } from './cash.dto';
import { Cash } from './cash.entity';
import { ICash } from './cash.interface';

@Injectable()
export class CashService extends ApiService<
  CashDto,
  ICash,
  Cash,
  Repository<Cash>
> {
  constructor(
    @InjectRepository(Cash)
    protected readonly cashRepository: Repository<Cash>,
    @Inject('CACHE_INSTANCE') protected cacheManager: HybridCache,
    protected utilsService: UtilsService,
  ) {
    super('cash', cashRepository, cacheManager, utilsService, CashService.name);
  }

  override async convertSingleDtoToEntity(dto: CashDto): Promise<Cash> {
    let cash = new Cash();
    if (dto.id && dto.id && dto.id != '') {
      const dbData = await this.repository.findOne({
        where: { id: dto.id },
      });
      if (!dbData) {
        throw new NotFoundException(
          'No such entity data found for update! Please, Try Again.',
        );
      }
      cash = dbData;
    }
    cash = {
      ...cash,
      ...dto,
      ...{
        date: new Date(),
        cashBy: { id: dto.cashById } as User,
      },
    };
    return cash;
  }

  override async getSelectQuery(
    query: SelectQueryBuilder<Cash>,
    select?: string[],
  ) {
    if (!select || !select.length) {
      select = ['id', 'name', 'createdAt', 'deletedAt'];
    }
    const selectFields = select.map((field) => `${this.entityName}.${field}`);

    selectFields.push('cashBy.name');
    selectFields.push('cashBy.id');
    query.leftJoinAndSelect('cash.cashBy', 'cashBy');
    query.select(selectFields);
    const cacheKey = selectFields.join(',');
    return { query, cacheKey, isRaw: false };
  }
}
