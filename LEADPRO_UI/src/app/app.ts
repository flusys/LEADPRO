import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LibAppConfigComponent } from '@flusys/flusysng/core/components';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LibAppConfigComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
