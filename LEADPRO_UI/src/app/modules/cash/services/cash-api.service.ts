import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ɵFormGroupValue } from '@angular/forms';
import { ApiService } from '@flusys/flusysng/shared/classes';
import { ICash } from '../interfaces/cash-data.interface';
import { ICashForm } from '../interfaces/cash-form.interface';

@Injectable({
  providedIn: 'root'
})
export class CashApiService extends ApiService<ɵFormGroupValue<ICashForm>, ICash> {


  constructor() {
    const http = inject(HttpClient);

    super("cash", http)

  }
}
