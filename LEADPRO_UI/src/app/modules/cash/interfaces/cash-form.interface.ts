import { FormControl } from "@angular/forms";
import { ICommonForm } from "@flusys/flusysng/shared/interfaces";
import { CashTransactionType } from "../cash-transaction-type.enum";

export interface ICashForm extends ICommonForm {
    amount: FormControl<number>;
    type: FormControl<CashTransactionType>;
    note: FormControl<string | null>; // optional
    cashById: FormControl<number>;
}
