import { Component, DestroyRef, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UiCardComponent } from '../../../../shared/ui/card/ui-card.component';
import { UiToggleComponent } from '../../../../shared/ui/toggle/ui-toggle.component';
import { UiButtonComponent } from '../../../../shared/ui/button/ui-button.component';
import { ToastService } from '../../../../core/services/toast.service';
import { ThemePreset, ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [NgFor, UiCardComponent, UiToggleComponent, UiButtonComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  private readonly toastService = inject(ToastService);
  private readonly themeService = inject(ThemeService);
  private readonly destroyRef = inject(DestroyRef);

  notifications = true;
  weeklyDigest = true;
  productUpdates = false;
  enforceMfa = true;

  activePreset: ThemePreset = 'blue';
  presetOptions: Array<{ id: ThemePreset; label: string; color: string }> = [
    { id: 'blue', label: 'Blue', color: '#2563eb' },
    { id: 'purple', label: 'Purple', color: '#7c3aed' },
    { id: 'emerald', label: 'Emerald', color: '#059669' },
    { id: 'rose', label: 'Rose', color: '#e11d48' },
    { id: 'amber', label: 'Amber', color: '#f59e0b' }
  ];

  constructor() {
    this.themeService.preset$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(preset => {
        this.activePreset = preset;
      });
  }

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

  setPreset(preset: ThemePreset) {
    this.themeService.setPreset(preset);
  }
}
