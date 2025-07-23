import { Injectable, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FormCommonClass } from '@flusys/flusysng/shared/classes';
import { IExpenseForm } from '../interfaces/expense-form.interface';
import { ExpenseType } from '../expense-type.enum';

@Injectable({
  providedIn: 'root'
})
export class ExpenseFormService extends FormCommonClass<IExpenseForm> {

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() {
    const messageService = inject(MessageService);

    super(messageService)

    this.initForm();
  }


  initForm() {
    this.formGroup = new FormGroup<IExpenseForm>({
      id: new FormControl(0, { nonNullable: true }),
      title: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      description: new FormControl<string | null>(null), // optional
      amount: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0.01)],
      }),
      type: new FormControl<ExpenseType>(ExpenseType.VARIABLE, {
        nonNullable: true,
      }),
      recordedById: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

}

