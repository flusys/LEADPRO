import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ɵFormGroupValue } from '@angular/forms';
import { ApiService } from '@flusys/flusysng/shared/classes';
import { IExpenseForm } from '../interfaces/expense-form.interface';
import { IExpense } from '../interfaces/expense-data.interface';

@Injectable({
  providedIn: 'root'
})
export class ExpenseApiService extends ApiService<ɵFormGroupValue<IExpenseForm>, IExpense> {


  constructor() {
    const http = inject(HttpClient);

    super("expense", http)

  }
}
