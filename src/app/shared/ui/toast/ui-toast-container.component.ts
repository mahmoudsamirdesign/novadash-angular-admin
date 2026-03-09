import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ToastService, ToastMessage } from '../../../core/services/toast.service';

@Component({
  selector: 'ui-toast-container',
  standalone: true,
  imports: [NgFor, NgIf, AsyncPipe],
  templateUrl: './ui-toast-container.component.html',
  styleUrl: './ui-toast-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiToastContainerComponent {
  private toastService = inject(ToastService);
  readonly toasts$ = this.toastService.toasts$;

  trackById = (_: number, toast: ToastMessage) => toast.id;

  dismiss(id: string) {
    this.toastService.dismiss(id);
  }

  iconFor(variant?: string) {
    switch (variant) {
      case 'success':
        return 'check_circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  }
}
