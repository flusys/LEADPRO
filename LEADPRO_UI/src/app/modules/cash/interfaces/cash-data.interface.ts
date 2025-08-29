import { IUser } from "@flusys/flusysng/modules/settings/user/interfaces";
import { ICommonData } from "@flusys/flusysng/shared/interfaces";
import { CashTransactionType } from "../cash-transaction-type.enum";

export interface ICash extends ICommonData {
  cashBy: IUser;
  date: Date;
  amount: number;
  type: CashTransactionType;
  note: string | null;
}
