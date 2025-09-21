import { User } from '@flusys/flusysnest/persistence/entities';
import { ApiService, HybridCache } from '@flusys/flusysnest/shared/classes';
import { FilterAndPaginationDto } from '@flusys/flusysnest/shared/dtos';
import { UtilsService } from '@flusys/flusysnest/shared/modules';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { EncryptionDataDto, EncryptionKeyDto } from './encryption.dto';
import { EncryptionData, EncryptionKey } from './encryption.entity';
import { IEncryptionData, IEncryptionKey } from './encryption.interface';

@Injectable()
export class EncryptionKeyService extends ApiService<
  EncryptionKeyDto,
  IEncryptionKey,
  EncryptionKey,
  Repository<EncryptionKey>
> {
  constructor(
    @InjectRepository(EncryptionKey)
    protected readonly expenseRepository: Repository<EncryptionKey>,
    @Inject('CACHE_INSTANCE') protected cacheManager: HybridCache,
    protected utilsService: UtilsService,
  ) {
    super(
      'encrypted_key',
      expenseRepository,
      cacheManager,
      utilsService,
      EncryptionKeyService.name,
    );
  }

  override async convertSingleDtoToEntity(
    dto: EncryptionKeyDto,
  ): Promise<EncryptionKey> {
    let key = new EncryptionKey();
    if (dto.id && dto.id !== '') {
      const dbData = await this.repository.findOne({
        where: { id: dto.id },
      });
      if (!dbData) {
        throw new NotFoundException(
          'No such entity data found for update! Please, Try Again.',
        );
      }
      key = {
        ...dbData,
        ...dto,
        user: { id: dto['updatedBy'].id } as User,
      };
    } else {
      key = {
        ...key,
        ...dto,
        user: { id: dto['createdBy'].id } as User,
      };
    }
    return key;
  }

  protected async getExtraManipulateQuery(
    query: SelectQueryBuilder<EncryptionKey>,
    dto: FilterAndPaginationDto,
  ) {
    query.innerJoin('encrypted_key.user', 'user');
    query.andWhere(`user.id = :userId`, {
      userId: dto['user'].id,
    });
    return { query, isRaw: false };
  }
}

@Injectable()
export class EncryptionDataService extends ApiService<
  EncryptionDataDto,
  IEncryptionData,
  EncryptionData,
  Repository<EncryptionData>
> {
  constructor(
    @InjectRepository(EncryptionData)
    protected readonly encryptedDataRepository: Repository<EncryptionData>,
    @Inject('CACHE_INSTANCE') protected cacheManager: HybridCache,
    protected utilsService: UtilsService,
  ) {
    super(
      'encrypted_data',
      encryptedDataRepository,
      cacheManager,
      utilsService,
      EncryptionDataService.name,
    );
  }

  override async getSelectQuery(
    query: SelectQueryBuilder<EncryptionData>,
    select?: string[],
  ) {
    if (!select || !select.length) {
      select = [
        'id',
        'key',
        'storedEncryptionData',
        'storedIV',
        'storedEncryptionAESKey',
      ];
    }
    const selectFields = select.map((field) => `${this.entityName}.${field}`);
    selectFields.push('key.name');
    selectFields.push('key.id');
    query.leftJoinAndSelect('encrypted_data.key', 'key');
    query.select(selectFields);
    return { query, isRaw: false };
  }
  override async getFilterQuery(
    query: SelectQueryBuilder<EncryptionData>,
    filter: { [key: string]: any },
  ): Promise<{ query: SelectQueryBuilder<EncryptionData>; isRaw: boolean }> {
    Object.entries(filter).forEach(([key, value]) => {
      if (key == 'key_id') {
        query.andWhere(`key.id = :value`, { value });
      } else {
        query.andWhere(`${this.entityName}.${key} = :value`, { value });
      }
    });
    return { query, isRaw: false };
  }

  override async convertSingleDtoToEntity(
    dto: EncryptionDataDto,
  ): Promise<EncryptionData> {
    let key = new EncryptionData();
    if (dto.id && dto.id !== '') {
      const dbData = await this.repository.findOne({
        where: { id: dto.id },
      });
      if (!dbData) {
        throw new NotFoundException(
          'No such entity data found for update! Please, Try Again.',
        );
      }
      key = {
        ...dbData,
        ...dto,
        key: { id: dto.key } as EncryptionKey,
      };
    } else {
      key = {
        ...key,
        ...dto,
        key: { id: dto.key } as EncryptionKey,
      };
    }
    return key;
  }
}
