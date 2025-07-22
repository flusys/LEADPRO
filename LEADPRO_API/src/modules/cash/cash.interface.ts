import { IUser } from "@flusys/flusysnest/modules/settings/interfaces";
import { CashTransactionType } from "./cash-transaction-type.enum";

export interface ICash {
    id: number;
    cashBy: IUser;
    date: Date;
    amount: number;
    type: CashTransactionType;
    note: string | null;
}
