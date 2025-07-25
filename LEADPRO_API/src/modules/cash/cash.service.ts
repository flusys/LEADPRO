import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { UtilsService } from '@flusys/flusysnest/shared/modules';
import { ApiService } from '@flusys/flusysnest/shared/apis';
import { FilterAndPaginationDto } from '@flusys/flusysnest/shared/dtos';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CashDto } from './cash.dto';
import { Cash } from './cash.entity';
import { ICash } from './cash.interface';
import { Cache } from "cache-manager";
import { User } from '@flusys/flusysnest/persistence/entities';

@Injectable()
export class CashService extends ApiService<CashDto, ICash, Cash, Repository<Cash>> {

  constructor(
    @InjectRepository(Cash)
    protected readonly cashRepository: Repository<Cash>,
    @Inject(CACHE_MANAGER) protected cacheManager: Cache,
    protected utilsService: UtilsService,
  ) {
    super(
      'cash',
      cashRepository,
      cacheManager,
      utilsService,
      CashService.name
    );
  }

  override async convertSingleDtoToEntity(dto: CashDto): Promise<Cash> {
    let cash = new Cash();
    if (dto.id && dto.id && dto.id != '') {
      const dbData = await this.repository.findOne({
        where: { id: dto.id },
      });
      if (!dbData) {
        throw new NotFoundException(
          'No such entity data found for update! Please, Try Again.'
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
      }
    };
    return cash;
  }

  override getSelectQuery(query: SelectQueryBuilder<Cash>, select?: string[]): { query: SelectQueryBuilder<Cash>, cacheKey: string, isRaw: boolean } {
    if (!select || !select.length) {
      select = ['id', 'name', 'createdAt', 'deletedAt'];
    }
    const selectFields = select.map(field => `${this.entityName}.${field}`);

    selectFields.push("cashBy.name");
    selectFields.push("cashBy.id");
    query.leftJoinAndSelect("cash.cashBy", "cashBy");
    query.select(selectFields);
    const cacheKey = selectFields.join(',');
    return { query, cacheKey, isRaw: false };
  }

}
