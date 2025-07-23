import { Component, computed, inject } from '@angular/core';
import { IUserCashSummary } from '../../dashboard.interface';
import { DashboardApiService } from '../../dashboard.service';
import { AngularModule, PrimeModule } from '@flusys/flusysng/shared/modules';

@Component({
  selector: 'app-user-wise-cash',
  imports: [
    AngularModule,
    PrimeModule
  ],
  templateUrl: './user-wise-cash.html',
  styleUrl: './user-wise-cash.scss'
})
export class UserWiseCash {
  dashboardService = inject(DashboardApiService);

  userCashList = computed((): IUserCashSummary[] => {
    const data = this.dashboardService.userSummary.value();
    return data
  });
}
