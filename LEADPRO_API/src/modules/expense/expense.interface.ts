import { IUser } from "@flusys/flusysnest/modules/settings/interfaces";
import { ExpenseType } from "./expense-type.enum";

export interface IExpense {
  id: number;
  title: string;
  description: string | null;
  amount: number;
  type: ExpenseType;
  date: Date;
  recordedBy: IUser;
}
