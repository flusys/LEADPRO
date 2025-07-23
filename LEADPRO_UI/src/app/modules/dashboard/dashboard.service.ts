import { Injectable, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { IDashboard, IUserCashSummary } from './dashboard.interface';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DashboardApiService {
    public baseUrl = environment.apiBaseUrl + '/dashboard';

    readonly dashboardResource = httpResource<IDashboard>(() => {
        return {
            url: this.baseUrl,
            method: 'GET',
        };
    }, {
        defaultValue: {
            totalCashAmount: 0,
            lastMonthCashAmount: 0,
            totalExpense: 0,
        },
    });

    readonly userSummary = httpResource<IUserCashSummary[]>(() => {
        return {
            url: this.baseUrl + '/user-summary',
            method: 'GET',
        };
    }, {
        defaultValue: [],
    });




}