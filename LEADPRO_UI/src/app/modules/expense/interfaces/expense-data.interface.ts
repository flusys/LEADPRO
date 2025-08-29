import { ICommonData } from "@flusys/flusysng/shared/interfaces";
import { ExpenseType } from "../expense-type.enum";
import { IUser } from "@flusys/flusysng/modules/settings/user/interfaces";

export interface IExpense extends ICommonData {
  title: string;
  description: string | null;
  amount: number;
  type: ExpenseType;
  date: Date;
  recordedBy: IUser;
}
