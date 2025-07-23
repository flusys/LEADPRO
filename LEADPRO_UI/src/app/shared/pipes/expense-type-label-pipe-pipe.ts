import { Pipe, PipeTransform } from '@angular/core';
import { ExpenseType } from '../../modules/expense/expense-type.enum';

@Pipe({
  name: 'expenseTypeLabel',
  standalone: true,
})
export class ExpenseTypeLabelPipe implements PipeTransform {
  private readonly map = new Map<ExpenseType, string>([
    [ExpenseType.ONE_TIME, 'One Time'],
    [ExpenseType.FIXED, 'Fixed'],
    [ExpenseType.VARIABLE, 'Variable'],
  ]);

  transform(value: ExpenseType): string {
    return this.map.get(value) ?? value;
  }
}
