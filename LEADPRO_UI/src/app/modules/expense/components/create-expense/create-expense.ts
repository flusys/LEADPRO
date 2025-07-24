import { Component, effect, ElementRef, inject, viewChild, viewChildren } from '@angular/core';
import { NgForm, FormControlName, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { IExpense } from '../../interfaces/expense-data.interface';
import { ExpenseApiService } from '../../services/expense-api.service';
import { ExpenseFormService } from '../../services/expense-form.service';
import { ExpenseStateService } from '../../services/expense-state.service';
import { AngularModule, PrimeModule } from '@flusys/flusysng/shared/modules';
import { UserDropdownComponent } from '@flusys/flusysng/shared/components'
import { ZeroToNullDirective } from '@flusys/flusysng/shared/directives';

@Component({
  selector: 'app-create-expense',
  imports: [
    AngularModule,
    PrimeModule,

    UserDropdownComponent,
    ZeroToNullDirective
  ],
  templateUrl: './create-expense.html',
  styleUrl: './create-expense.scss'
})
export class CreateExpense {
  expenseFormService = inject(ExpenseFormService);
  expenseStateService = inject(ExpenseStateService);
  expenseApiService = inject(ExpenseApiService);
  private messageService = inject(MessageService);

  isPanelCollapsed = true;
  model: IExpense | undefined;


  readonly inputForm = viewChild.required<NgForm>('inputForm');
  readonly formControls = viewChildren(FormControlName, { read: ElementRef });

  constructor() {
    effect(() => {
      const model = this.expenseStateService.select('editModelData')() ?? undefined;
      if (model) {
        this.model = model;
        this.isPanelCollapsed = false;
        this.expenseFormService.patchValue({ ...model });
      } else {
        this.model = undefined;
      }
    });
  }


  onSubmit() {
    if (this.expenseFormService.formGroup.invalid) {
      this.expenseFormService.focusFirstInvalidInput(this.formControls() as ElementRef<any>[]);
      return;
    }
    let data = this.expenseFormService.formGroup.value;

    (this.model ? this.expenseApiService.update(data) : this.expenseApiService.insert(data)).pipe(take(1)).subscribe((res) => {
      if (res.success) {
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: res.message });
        this.expenseFormService.patchValue({ ...res.result });
        this.expenseStateService.addOrUpdateDataList(this.expenseFormService.value);
        this.clearInputForm()
      } else {
        return this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Sorry!', detail: res.message });
      }
    })
  }

  getControl(name:string){
    return this.expenseFormService.control(name) as FormControl;
  }


  clearInputForm() {
    this.expenseFormService.reset();
    this.inputForm().reset();
    this.model = undefined;
    this.expenseStateService.setState({ editModelData: null });
  }

}
