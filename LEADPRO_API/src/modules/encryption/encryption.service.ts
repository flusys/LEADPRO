import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ApiService } from '@flusys/flusysnest/shared/apis';
import { EncryptionData, EncryptionKey } from './encryption.entity';
import { UtilsService } from '@flusys/flusysnest/shared/modules';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { EncryptionDataDto, EncryptionKeyDto } from './encryption.dto';
import { IEncryptionData, IEncryptionKey } from './encryption.interface';
import { Cache } from 'cache-manager';
import { User } from '@flusys/flusysnest/persistence/entities';
import { FilterAndPaginationDto } from '@flusys/flusysnest/shared/dtos';

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
    @Inject(CACHE_MANAGER) protected cacheManager: Cache,
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
    @Inject(CACHE_MANAGER) protected cacheManager: Cache,
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
