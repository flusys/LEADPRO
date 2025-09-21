import { ApiController } from '@flusys/flusysnest/shared/classes';
import { TypeOrmExceptionFilter } from '@flusys/flusysnest/shared/errors';
import { JwtAuthGuard } from '@flusys/flusysnest/shared/guards';
import { Controller, UseFilters, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CashDto } from './cash.dto';
import { ICash } from './cash.interface';
import { CashService } from './cash.service';

@Controller('cash')
@ApiBearerAuth()
@UseFilters(TypeOrmExceptionFilter)
@UseGuards(JwtAuthGuard)
export class CashController extends ApiController<CashDto, ICash, CashService> {
  constructor(protected cashService: CashService) {
    super(cashService);
  }
}
