import { Module } from '@nestjs/common';

import { EncryptionDataService, EncryptionKeyService } from './encryption.service';
import { EncryptionDataController, EncryptionKeyController } from './encryption.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EncryptionData, EncryptionKey } from './encryption.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EncryptionKey,
      EncryptionData
    ]),
  ],
  providers: [EncryptionKeyService,EncryptionDataService],
  controllers: [EncryptionKeyController,EncryptionDataController],
})
export class EncryptionModule { }
