import { FormControl } from "@angular/forms";
import { ICommonForm } from "@flusys/flusysng/shared/interfaces";
import { ExpenseType } from "../expense-type.enum";

export interface IExpenseForm extends ICommonForm {
title: FormControl<string>;
  description: FormControl<string | null>;           // optional
  amount: FormControl<number>;
  type: FormControl<ExpenseType>;                    // optional with default
  recordedById: FormControl<number>;
}
