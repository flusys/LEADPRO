import { effect, Injectable, inject, untracked, signal } from '@angular/core';
import { ɵFormGroupValue } from '@angular/forms';
import { take } from 'rxjs';
import { getInitResponse, Store } from '@flusys/flusysng/shared/classes';
import { IFilter, ISort, IResponsePayload } from '@flusys/flusysng/shared/interfaces';
import { CashApiService } from './cash-api.service';
import { ICash } from '../interfaces/cash-data.interface';
import { ICashForm } from '../interfaces/cash-form.interface';
import { CashTransactionType } from '../cash-transaction-type.enum';

interface StoreState {
  data: IResponsePayload<ICash[]>,

  filter: IFilter | null,
  sort: ISort | null,
  select: string[],

  editModelData: ICash | null,

  loading: boolean,
}

const InitValue: StoreState = {
  data: getInitResponse<ICash[]>([]),

  filter: null,
  sort: { id: 'ASC' },
  select: ['id', 'date', 'amount', 'type', 'note', 'createdAt', 'deletedAt'],

  editModelData: null,
  loading: false,
};

@Injectable({
  providedIn: 'root'
})
export class CashStateService extends Store<StoreState> {
  private folderApiService = inject(CashApiService);

  transactionTypes = signal([
    { label: 'Credit', value: CashTransactionType.CREDIT },
    { label: 'Debit', value: CashTransactionType.DEBIT }]
  )
  withDeleted: boolean = false;

  constructor() {
    super(InitValue);
    effect(() => {
    this.select('select')();
    this.select('sort')();
    this.select('filter')();
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
    this.folderApiService.getAll('', body).pipe(take(1)).subscribe(res => {
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

  addOrUpdateDataList(data: ɵFormGroupValue<ICashForm>) {
    let stateValue = this.select('data')();
    let result = stateValue.result;

    if (data.id) {
      let item = result.find((item) => item.id == data.id)
      if (item) {
        result = result.map((item) => item.id == data.id ? { ...item, ...data } : item)
      } else {
        result.push(data as ICash);
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
