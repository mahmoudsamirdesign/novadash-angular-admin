import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'ui-field',
  standalone: true,
  imports: [NgIf],
  templateUrl: './ui-field.component.html',
  styleUrl: './ui-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiFieldComponent {
  @Input() label = '';
  @Input() hint = '';
  @Input() error = '';
  @Input() required = false;
}
