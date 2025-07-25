import { Component, inject } from '@angular/core';
import { IDeleteData } from '@flusys/flusysng/shared/interfaces';
import { AngularModule, PrimeModule } from '@flusys/flusysng/shared/modules';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { ICash } from '../../interfaces/cash-data.interface';
import { CashApiService } from '../../services/cash-api.service';
import { CashStateService } from '../../services/cash-state.service';
import { CashTransactionLabelPipe } from '../../../../shared/pipes/cash-transaction-label-pipe-pipe';

@Component({
  selector: 'app-cash-list',
  imports: [
    AngularModule,
    PrimeModule,

    CashTransactionLabelPipe
  ],
  templateUrl: './cash-list.html',
  styleUrl: './cash-list.scss'
})
export class CashList {
  cashStateService = inject(CashStateService);
  cashApiService = inject(CashApiService);
  private messageService = inject(MessageService);
  constructor() {
  }

  selectedCash: ICash[] = [];
  globalFilterField: string[] = ['title'];


  withDeletedItem(type?: number) {
    this.selectedCash = [];
    this.cashStateService.withDeleted = !this.cashStateService.withDeleted;
    if (!type) {
      if (this.cashStateService.withDeleted) {
        this.cashStateService.callApi();
      } else {
        this.cashStateService.deleteItemFromList('restore', []);
      }
    }
  }


  getInputString(event: any) {
    return event.target.value;
  }

  editCash(cash: ICash) {
    this.cashStateService.setState({ editModelData: null });
    this.cashStateService.setState({ editModelData: cash });
  }

  deleteOrRestore(type: string) {
    if (this.selectedCash.length) {
      let ids: string[] = [];
      if (type == 'restore') {
        ids = this.selectedCash.filter((item) => item.deletedAt).map((item) => item.id);
      } else {
        ids = this.selectedCash.filter((item) => !item.deletedAt).map((item) => item.id);
      }

      if (!ids.length) return;
      const deleteData: IDeleteData = {
        id: ids,
        type: type == 'restore' ? 'restore' : 'delete'
      }
      this.cashApiService.delete(deleteData).pipe(take(1)).subscribe((result) => {
        if (result.success) {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: result.message });
          this.cashStateService.deleteItemFromList(type == 'restore' ? 'restore' : 'delete', ids);
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
        detail: "Need to Select cash first!"
      });
    }
  }

  clearAll() {
    this.selectedCash = []
  }
}
