import { Component, effect, ElementRef, inject, signal, viewChild, viewChildren } from '@angular/core';
import { NgForm, FormControlName, FormControl } from '@angular/forms';
import { AngularModule, PrimeModule } from '@flusys/flusysng/shared/modules';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { ICash } from '../../interfaces/cash-data.interface';
import { CashApiService } from '../../services/cash-api.service';
import { CashFormService } from '../../services/cash-form.service';
import { CashStateService } from '../../services/cash-state.service';
import { UserSelectComponent } from '@flusys/flusysng/shared/components'
import { ZeroToNullDirective } from '@flusys/flusysng/shared/directives';
import { IDropDown } from '@flusys/flusysng/shared/interfaces';

@Component({
  selector: 'app-create-cash',
  imports: [
    AngularModule,
    PrimeModule,
    UserSelectComponent,
    ZeroToNullDirective
  ],
  templateUrl: './create-cash.html',
  styleUrl: './create-cash.scss'
})
export class CreateCash {
  cashFormService = inject(CashFormService);
  cashStateService = inject(CashStateService);
  cashApiService = inject(CashApiService);
  private messageService = inject(MessageService);

  isPanelCollapsed = true;
  model: ICash | undefined;


  cashBy = signal<IDropDown | null>(null);
  readonly inputForm = viewChild.required<NgForm>('inputForm');
  readonly formControls = viewChildren(FormControlName, { read: ElementRef });

  constructor() {
    effect(() => {
      const model = this.cashStateService.select('editModelData')() ?? undefined;
      if (model) {
        this.model = model;
        this.isPanelCollapsed = false;
        this.cashFormService.patchValue({
          ...model,
          ...{
            cashById: model.cashBy?.id
          }
        });
        this.cashBy.set(model.cashBy ? {
          label: model.cashBy?.name,
          value: model.cashBy?.id
        } : null);
      } else {
        this.model = undefined;
      }
    });
  }


  onSubmit() {
    if (this.cashFormService.formGroup.invalid) {
      this.cashFormService.focusFirstInvalidInput(this.formControls() as ElementRef<any>[]);
      return;
    }

    let data = this.cashFormService.formGroup.value;
    (this.model ? this.cashApiService.update(data) : this.cashApiService.insert(data)).pipe(take(1)).subscribe((res) => {
      if (res.success) {
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: res.message });
        this.cashFormService.patchValue({ ...res.result });
        this.cashStateService.reset();
        this.clearInputForm()
      } else {
        return this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Sorry!', detail: res.message });
      }
    })
  }

  getControl(name: string) {
    return this.cashFormService.control(name) as FormControl;
  }

  clearInputForm() {
    this.cashFormService.reset();
    this.inputForm().reset();
    this.model = undefined;
    this.cashStateService.setState({ editModelData: null });
  }
}
