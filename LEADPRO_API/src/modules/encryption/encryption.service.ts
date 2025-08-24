import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiService } from '@flusys/flusysnest/shared/apis';
import { EncryptionData, EncryptionKey } from './encryption.entity';
import { UtilsService } from '@flusys/flusysnest/shared/modules';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { EncryptionDataDto, EncryptionKeyDto } from './encryption.dto';
import { IEncryptionData, IEncryptionKey } from './encryption.interface';
import { Cache } from 'cache-manager';


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
      'encrypted-key',
      expenseRepository,
      cacheManager,
      utilsService,
      EncryptionKeyService.name,
    );
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
      'encrypted-data',
      encryptedDataRepository,
      cacheManager,
      utilsService,
      EncryptionDataService.name,
    );
  }
}
