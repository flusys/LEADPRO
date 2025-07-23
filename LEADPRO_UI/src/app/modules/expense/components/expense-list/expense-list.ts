import { Component, inject } from '@angular/core';
import { IDeleteData } from '@flusys/flusysng/shared/interfaces';
import { AngularModule, PrimeModule } from '@flusys/flusysng/shared/modules';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { IExpense } from '../../interfaces/expense-data.interface';
import { ExpenseApiService } from '../../services/expense-api.service';
import { ExpenseStateService } from '../../services/expense-state.service';
import { ExpenseTypeLabelPipe } from '../../../../shared/pipes/expense-type-label-pipe-pipe';

@Component({
  selector: 'app-expense-list',
  imports: [
    AngularModule,
    PrimeModule,

    ExpenseTypeLabelPipe
  ],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.scss'
})
export class ExpenseList {
  expenseStateService = inject(ExpenseStateService);
  expenseApiService = inject(ExpenseApiService);
  private messageService = inject(MessageService);
  constructor() {
  }

  selectedExpense: IExpense[] = [];
  globalFilterField: string[] = ['title'];


  withDeletedItem(type?: number) {
    this.selectedExpense = [];
    this.expenseStateService.withDeleted = !this.expenseStateService.withDeleted;
    if (!type) {
      if (this.expenseStateService.withDeleted) {
        this.expenseStateService.callApi();
      } else {
        this.expenseStateService.deleteItemFromList('restore', []);
      }
    }
  }


  getInputString(event: any) {
    return event.target.value;
  }

  editExpense(expense: IExpense) {
    this.expenseStateService.setState({ editModelData: null });
    this.expenseStateService.setState({ editModelData: expense });
  }

  deleteOrRestore(type: string) {
    if (this.selectedExpense.length) {
      let ids: number[] = [];
      if (type == 'restore') {
        ids = this.selectedExpense.filter((item) => item.deletedAt).map((item) => item.id);
      } else {
        ids = this.selectedExpense.filter((item) => !item.deletedAt).map((item) => item.id);
      }

      if (!ids.length) return;
      const deleteData: IDeleteData = {
        id: ids,
        type: type == 'restore' ? 'restore' : 'delete'
      }
      this.expenseApiService.delete(deleteData).pipe(take(1)).subscribe((result) => {
        if (result.success) {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: result.message });
          this.expenseStateService.deleteItemFromList(type == 'restore' ? 'restore' : 'delete', ids);
          if (type == 'restore')
            this.withDeletedItem(1);
          this.clearAll()
        } else {
          this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Sorry!', detail: result.message });
        }
      }, (err) => {
        this.messageService.add({
          key: 'tst',
          severity: 'warn',
          summary: 'Sorry!',
          detail: Array.isArray(err.error.message) ? err.error.message[0] : err.error.message
        });
      })
    } else {
      this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Sorry!',
        detail: "Need to Select expense first!"
      });
    }
  }

  clearAll() {
    this.selectedExpense = []
  }
}
