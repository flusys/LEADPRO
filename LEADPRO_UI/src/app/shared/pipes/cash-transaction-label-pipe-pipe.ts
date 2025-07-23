import { Pipe, PipeTransform } from '@angular/core';
import { CashTransactionType } from '../../modules/cash/cash-transaction-type.enum';

@Pipe({
  name: 'cashTransactionLabel',
  standalone: true,
})
export class CashTransactionLabelPipe implements PipeTransform {
  private readonly map = new Map<CashTransactionType, string>([
    [CashTransactionType.CREDIT, 'Credit'],
    [CashTransactionType.DEBIT, 'Debit'],
  ]);

  transform(value: CashTransactionType): string {
    return this.map.get(value) ?? value;
  }
}
