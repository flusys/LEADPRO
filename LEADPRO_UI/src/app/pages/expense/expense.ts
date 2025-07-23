import { Component } from '@angular/core';
import { CreateExpense } from '../../modules/expense/components/create-expense/create-expense';
import { ExpenseList } from '../../modules/expense/components/expense-list/expense-list';

@Component({
  selector: 'app-expense',
  imports: [
    CreateExpense,
    ExpenseList
  ],
  templateUrl: './expense.html',
  styleUrl: './expense.scss'
})
export class Expense {

}
