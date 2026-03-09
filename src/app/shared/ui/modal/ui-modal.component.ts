import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Inject, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'ui-modal',
  standalone: true,
  imports: [NgIf],
  templateUrl: './ui-modal.component.html',
  styleUrl: './ui-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiModalComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() description = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() dismissible = true;
  @Output() closed = new EventEmitter<void>();

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  @HostListener('document:keydown.escape')
  onEscape() {
    if (!this.dismissible || !this.open || !isPlatformBrowser(this.platformId)) {
      return;
    }
    this.closed.emit();
  }

  onBackdropClick() {
    if (!this.dismissible) {
      return;
    }
    this.closed.emit();
  }
}
