export interface IDashboard {
  totalCashAmount: number;
  lastMonthCashAmount: number;
  totalExpense: number;
}

export interface IUserCashSummary {
  userId: string;
  userName: string;
  userImage: string | null;
  cashAmount: number;
}
