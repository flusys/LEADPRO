import {
  Controller,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { TypeOrmExceptionFilter } from "@flusys/flusysnest/shared/errors";
import { JwtAuthGuard } from "@flusys/flusysnest/core/guards";
import { ApiController } from '@flusys/flusysnest/shared/apis';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ExpenseDto } from './expense.dto';
import { IExpense } from './expense.interface';
import { ExpenseService } from './expense.service';

@Controller('expense')
@ApiBearerAuth()
@UseFilters(TypeOrmExceptionFilter)
@UseGuards(JwtAuthGuard)
export class ExpenseController extends ApiController<
ExpenseDto,
IExpense,
ExpenseService
> {
constructor(protected expenseService:ExpenseService) {
  super(expenseService);
}
}
