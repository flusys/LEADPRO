import { effect, Injectable, inject, untracked, signal } from '@angular/core';
import { ɵFormGroupValue } from '@angular/forms';
import { take } from 'rxjs';
import { getInitResponse, Store } from '@flusys/flusysng/shared/classes';
import { IFilter, ISort, IResponsePayload } from '@flusys/flusysng/shared/interfaces';
import { ExpenseApiService } from './expense-api.service';
import { IExpense } from '../interfaces/expense-data.interface';
import { IExpenseForm } from '../interfaces/expense-form.interface';
import { ExpenseType } from '../expense-type.enum';

interface StoreState {
  data: IResponsePayload<IExpense[]>,

  filter: IFilter | null,
  sort: ISort | null,
  select: string[],

  editModelData: IExpense | null,

  loading: boolean,
}

const InitValue: StoreState = {
  data: getInitResponse<IExpense[]>([]),

  filter: null,
  sort: { id: 'ASC' },
  select: ['id', 'title', 'description', 'amount', 'type', 'date', 'createdAt', 'deletedAt'],

  editModelData: null,
  loading: false,
};

@Injectable({
  providedIn: 'root'
})
export class ExpenseStateService extends Store<StoreState> {
  private expenseApiService = inject(ExpenseApiService);
  expenseTypes = signal([
    { label: 'One Time', value: ExpenseType.ONE_TIME },
    { label: 'Fixed', value: ExpenseType.FIXED },
    { label: 'Variable', value: ExpenseType.VARIABLE },
  ])


  withDeleted: boolean = false;

  constructor() {
    super(InitValue);
    this.select('select')();
    this.select('sort')();
    this.select('filter')();
    effect(() => {
      untracked(() => {
        this.callApi();
      });
    });
  }

  callApi() {
    const select = this.select('select')() ?? undefined;
    const sort = this.select('sort')() ?? undefined;
    const filter = this.select('filter')() ?? undefined;
    const body = { select, sort, filter, withDeleted: this.withDeleted }
    this.setState({ loading: true, });
    this.expenseApiService.getAll('', body).pipe(take(1)).subscribe(res => {
      this.setState({ loading: false, });
      if (res.success) {
        this.setState({
          data: res,
        });
      }
    }, (err) => {
      this.setState({ loading: false, });
    });
  }

  addOrUpdateDataList(data: ɵFormGroupValue<IExpenseForm>) {
    let stateValue = this.select('data')();
    let result = stateValue.result;

    if (data.id) {
      let item = result.find((item) => item.id == data.id)
      if (item) {
        result = result.map((item) => item.id == data.id ? { ...item, ...data } : item)
      } else {
        result.push(data as IExpense);
      }
    }
    stateValue = { ...stateValue, ...{ result: result } }
    this.setState({ data: stateValue })
  }

  deleteItemFromList(type: 'delete' | 'restore', ids: number[]) {
    if (type == 'delete') {
      let stateValue = this.select('data')();
      let result = stateValue.result.filter((item) => !ids.includes(item.id));
      stateValue = { ...stateValue, ...{ result: result } }
      this.setState({ data: stateValue })
    } else {
      let stateValue = this.select('data')();
      let result = stateValue.result.map((item) => {
        if (ids.includes(item.id)) {
          return { ...item, ...{ deletedAt: undefined } }
        } else {
          return item;
        }
      }).filter((item) => !item.deletedAt);
      stateValue = { ...stateValue, ...{ result: result } }
      this.setState({ data: stateValue })
    }
  }

}
