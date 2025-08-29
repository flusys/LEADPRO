import { Component } from '@angular/core';
import { CreateCash } from '../../modules/cash/components/create-cash/create-cash';
import { CashList } from '../../modules/cash/components/cash-list/cash-list';

@Component({
  selector: 'app-cash',
  imports: [
    CreateCash,
    CashList
  ],
  templateUrl: './cash.html',
  styleUrl: './cash.scss'
})
export class Cash {

}
