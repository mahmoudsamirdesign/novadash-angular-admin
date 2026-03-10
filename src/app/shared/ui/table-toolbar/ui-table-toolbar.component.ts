import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiButtonComponent } from '../button/ui-button.component';

export interface TableToolbarFilter {
  key: string;
  label: string;
  options: string[];
  value?: string;
}

@Component({
  selector: 'ui-table-toolbar',
  standalone: true,
  imports: [NgFor, NgIf, TitleCasePipe, FormsModule, UiButtonComponent],
  templateUrl: './ui-table-toolbar.component.html',
  styleUrl: './ui-table-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiTableToolbarComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() searchPlaceholder = 'Search';
  @Input() searchAriaLabel = 'Search';
  @Input() searchValue = '';
  @Input() showSearch = true;
  @Input() filters: TableToolbarFilter[] = [];
  @Input() showExport = false;
  @Input() exportLabel = 'Export CSV';
  @Input() exportDisabled = false;

  @Output() searchChange = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<{ key: string; value: string }>();
  @Output() export = new EventEmitter<void>();

  trackByKey = (_: number, item: TableToolbarFilter) => item.key;

  onFilterChange(key: string, value: string) {
    this.filterChange.emit({ key, value });
  }
}
