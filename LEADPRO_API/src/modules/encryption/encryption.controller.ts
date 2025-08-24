import { Controller, UseFilters, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@flusys/flusysnest/core/guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiController } from '@flusys/flusysnest/shared/apis';
import { TypeOrmExceptionFilter } from '@flusys/flusysnest/shared/errors';
import { EncryptionDataDto, EncryptionKeyDto } from './encryption.dto';
import { IEncryptionData, IEncryptionKey } from './encryption.interface';
import { EncryptionDataService, EncryptionKeyService } from './encryption.service';

@Controller('encrypted-key')
@ApiBearerAuth()
@UseFilters(TypeOrmExceptionFilter)
@UseGuards(JwtAuthGuard)
export class EncryptionKeyController extends ApiController<
EncryptionKeyDto,
IEncryptionKey,
EncryptionKeyService
> {
constructor(protected encryptedKeyService:EncryptionKeyService) {
  super(encryptedKeyService);
}
}

@Controller('encrypted-data')
@ApiBearerAuth()
@UseFilters(TypeOrmExceptionFilter)
@UseGuards(JwtAuthGuard)
export class EncryptionDataController extends ApiController<
EncryptionDataDto,
IEncryptionData,
EncryptionDataService
> {
constructor(protected encryptedDataService:EncryptionDataService) {
  super(encryptedDataService);
}
}