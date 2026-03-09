import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ui-card',
  standalone: true,
  templateUrl: './ui-card.component.html',
  styleUrl: './ui-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'ui-card',
    '[class.sm]': "padding === 'sm'",
    '[class.lg]': "padding === 'lg'"
  }
})
export class UiCardComponent {
  @Input() padding: 'sm' | 'md' | 'lg' = 'md';
}
