import {
  Controller,
  Get,
  Res,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@flusys/flusysnest/core/guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiController } from '@flusys/flusysnest/shared/apis';
import { TypeOrmExceptionFilter } from '@flusys/flusysnest/shared/errors';
import { EncryptionDataDto, EncryptionKeyDto } from './encryption.dto';
import { IEncryptionData, IEncryptionKey } from './encryption.interface';
import {
  EncryptionDataService,
  EncryptionKeyService,
} from './encryption.service';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { Response } from 'express';
import os from 'os';
import path from 'path';

const DOWNLOAD_TOKENS = new Map<string, number>(); // token -> expiry timestamp

@Controller('encrypted-key')
@ApiBearerAuth()
@UseFilters(TypeOrmExceptionFilter)
@UseGuards(JwtAuthGuard)
export class EncryptionKeyController extends ApiController<
  EncryptionKeyDto,
  IEncryptionKey,
  EncryptionKeyService
> {
  constructor(protected encryptedKeyService: EncryptionKeyService) {
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
  constructor(protected encryptedDataService: EncryptionDataService) {
    super(encryptedDataService);
  }
  @Get('download')
  async downloadAll(
    @Res() res: Response,
    @Query('token') token?: string,
  ): Promise<void> {
    if (
      !token ||
      !DOWNLOAD_TOKENS.has(token) ||
      DOWNLOAD_TOKENS.get(token)! < Date.now()
    ) {
      res.status(403).send({ message: 'Invalid or expired token' });
      return;
    }
    DOWNLOAD_TOKENS.delete(token); // one-time use

    const tempFilePath = path.join(os.tmpdir(), 'passwords.json');
    try {

      // fs.writeFileSync(
      //   tempFilePath,
      //   JSON.stringify(passwordsFromDb, null, 2),
      //   'utf8',
      // );

      res.setHeader('Content-Type', 'application/json');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="passwords.json"',
      );

      res.sendFile(tempFilePath, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          if (!res.headersSent) res.status(500).send('Failed to download file');
        }
        // delete temp file
        fs.unlink(tempFilePath, (unlinkErr) => {
          if (unlinkErr)
            console.error('Failed to delete temp file:', unlinkErr);
        });
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  }

  @Get('download-token')
  generateDownloadToken(): { token: string; expires: number } {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 5 * 60 * 1000; // valid for 5 minutes
    DOWNLOAD_TOKENS.set(token, expires);
    return { token, expires };
  }
}
