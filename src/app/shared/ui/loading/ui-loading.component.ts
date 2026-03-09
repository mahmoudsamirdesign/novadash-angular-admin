import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'ui-loading',
  standalone: true,
  imports: [NgIf],
  templateUrl: './ui-loading.component.html',
  styleUrl: './ui-loading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiLoadingComponent {
  @Input() title = 'Loading';
  @Input() message = 'Please wait while we fetch your data.';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() inline = false;
}
