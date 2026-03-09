import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { UiButtonComponent } from '../button/ui-button.component';

@Component({
  selector: 'ui-error-state',
  standalone: true,
  imports: [NgIf, UiButtonComponent],
  templateUrl: './ui-error-state.component.html',
  styleUrl: './ui-error-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiErrorStateComponent {
  @Input() title = 'Something went wrong';
  @Input() message = 'We could not complete the request. Please try again.';
  @Input() icon = 'error_outline';
  @Input() actionLabel = '';
  @Input() actionVariant: 'primary' | 'secondary' | 'ghost' = 'primary';
  @Output() action = new EventEmitter<void>();
}
