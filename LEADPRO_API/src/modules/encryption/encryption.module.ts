import { Module } from '@nestjs/common';

import { EmailModule } from '@flusys/flusysnest/shared/modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EncryptedDownloadController,
  EncryptionDataController,
  EncryptionKeyController,
} from './encryption.controller';
import { EncryptionData, EncryptionKey } from './encryption.entity';
import {
  EncryptionDataService,
  EncryptionKeyService,
} from './encryption.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EncryptionKey, EncryptionData]),
    EmailModule,
  ],
  providers: [EncryptionKeyService, EncryptionDataService],
  controllers: [
    EncryptionKeyController,
    EncryptionDataController,
    EncryptedDownloadController,
  ],
})
export class EncryptionModule {}
