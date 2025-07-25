import { Injectable, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FormCommonClass } from '@flusys/flusysng/shared/classes';
import { ICashForm } from '../interfaces/cash-form.interface';
import { CashTransactionType } from '../cash-transaction-type.enum';

@Injectable({
  providedIn: 'root'
})
export class CashFormService extends FormCommonClass<ICashForm> {

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() {
    const messageService = inject(MessageService);

    super(messageService)

    this.initForm();
  }


  initForm() {
    this.formGroup = new FormGroup<ICashForm>({
      id: new FormControl('', { nonNullable: true }),
      amount: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0.01)],
      }),
      type: new FormControl<CashTransactionType>(CashTransactionType.CREDIT, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      note: new FormControl<string | null>(null), // optional
      cashById: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

}

