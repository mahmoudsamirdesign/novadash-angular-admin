import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { UiButtonComponent } from '../button/ui-button.component';

@Component({
  selector: 'ui-empty-state',
  standalone: true,
  imports: [NgIf, UiButtonComponent],
  templateUrl: './ui-empty-state.component.html',
  styleUrl: './ui-empty-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiEmptyStateComponent {
  @Input() title = 'Nothing here yet';
  @Input() message = 'Start by adding your first item.';
  @Input() icon = 'inbox';
  @Input() actionLabel = '';
  @Input() actionVariant: 'primary' | 'secondary' | 'ghost' = 'secondary';
  @Output() action = new EventEmitter<void>();
}
