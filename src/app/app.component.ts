import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { UiToastContainerComponent } from './shared/ui/toast/ui-toast-container.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UiToastContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-saas-starter';

  constructor(private themeService: ThemeService) {
    void this.themeService;
  }
}
