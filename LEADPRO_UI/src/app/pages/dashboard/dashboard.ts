import { Component, computed, inject } from '@angular/core';
import { UserWiseCash } from '../../modules/dashboard/components/user-wise-cash/user-wise-cash';
import { IDashboard } from '../../modules/dashboard/dashboard.interface';
import { DashboardApiService } from '../../modules/dashboard/dashboard.service';
import { AngularModule, PrimeModule } from '@flusys/flusysng/shared/modules';

@Component({
  selector: 'app-dashboard',
  imports: [
    AngularModule,
    PrimeModule,

    UserWiseCash
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  dashboardService = inject(DashboardApiService);

  dashboardCash = computed((): IDashboard => {
    const data = this.dashboardService.dashboardResource.value();
    return data
  });

}
