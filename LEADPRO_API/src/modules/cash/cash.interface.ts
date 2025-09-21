import { IUser } from '@flusys/flusysnest/modules/settings/interfaces';
import { IIdentity } from '@flusys/flusysnest/shared/interfaces';
import { CashTransactionType } from './cash-transaction-type.enum';

export interface ICash extends IIdentity {
  cashBy: IUser;
  date: Date;
  amount: number;
  type: CashTransactionType;
  note: string | null;
}
