import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-toggle',
  standalone: true,
  templateUrl: './ui-toggle.component.html',
  styleUrl: './ui-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiToggleComponent {
  @Input() checked = false;
  @Input() disabled = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  onToggle(event: Event) {
    const input = event.target as HTMLInputElement;
    this.checkedChange.emit(input.checked);
  }
}
