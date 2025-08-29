import { Module } from '@nestjs/common';

import { EncryptionDataService, EncryptionKeyService } from './encryption.service';
import { EncryptedDownloadController, EncryptionDataController, EncryptionKeyController } from './encryption.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EncryptionData, EncryptionKey } from './encryption.entity';
import { EmailModule } from '@flusys/flusysnest/shared/modules';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EncryptionKey,
      EncryptionData
    ]),
    EmailModule
  ],
  providers: [EncryptionKeyService,EncryptionDataService],
  controllers: [EncryptionKeyController,EncryptionDataController,EncryptedDownloadController],
})
export class EncryptionModule { }
