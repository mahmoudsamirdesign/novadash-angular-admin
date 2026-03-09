import { Component, inject } from '@angular/core';
import { UiCardComponent } from '../../../../shared/ui/card/ui-card.component';
import { UiToggleComponent } from '../../../../shared/ui/toggle/ui-toggle.component';
import { UiButtonComponent } from '../../../../shared/ui/button/ui-button.component';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [UiCardComponent, UiToggleComponent, UiButtonComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  private readonly toastService = inject(ToastService);

  notifications = true;
  weeklyDigest = true;
  productUpdates = false;
  enforceMfa = true;

  downloadAuditLog() {
    this.toastService.show({
      title: 'Audit log requested',
      message: 'Export will be available once storage is configured.',
      variant: 'info'
    });
  }

  saveChanges() {
    this.toastService.show({
      title: 'Settings saved',
      message: 'Workspace preferences have been updated.',
      variant: 'success'
    });
  }
}
