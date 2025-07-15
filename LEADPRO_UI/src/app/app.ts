import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { PrimeModule } from '@flusys/flusysng/shared/modules';
import { ApiLoaderService } from "@flusys/flusysng/core/services";
import { AuthenticationStateService } from '@flusys/flusysng/auth/services';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ConfirmDialog, PrimeModule, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  public apiLoaderService = inject(ApiLoaderService);
  authStateService: AuthenticationStateService = inject(AuthenticationStateService);

  constructor() {
    this.authStateService.currentCompanyInfo.update((prev) => {
      return {
        ...prev,
        ...{ appName: "LEADPRO" }
      }
    })
  }
}