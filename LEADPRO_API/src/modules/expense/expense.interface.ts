import { IUser } from '@flusys/flusysnest/modules/settings/interfaces';
import { IIdentity } from '@flusys/flusysnest/shared/interfaces';
import { ExpenseType } from './expense-type.enum';

export interface IExpense extends IIdentity {
  title: string;
  description: string | null;
  amount: number;
  type: ExpenseType;
  date: Date;
  recordedBy: IUser;
}
