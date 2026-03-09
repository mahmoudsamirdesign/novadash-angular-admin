import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { UiBadgeComponent } from '../badge/ui-badge.component';

export interface DataTableColumn {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  type?: 'text' | 'badge';
  badgeMap?: Record<string, 'success' | 'warning' | 'danger' | 'neutral' | 'info'>;
  format?: (value: unknown, row: Record<string, unknown>) => string;
}

@Component({
  selector: 'ui-data-table',
  standalone: true,
  imports: [NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, UiBadgeComponent],
  templateUrl: './ui-data-table.component.html',
  styleUrl: './ui-data-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiDataTableComponent {
  @Input() columns: DataTableColumn[] = [];
  @Input() rows: Record<string, unknown>[] = [];
  @Input() loading = false;
  @Input() emptyMessage = 'No data available.';

  trackByIndex = (index: number) => index;

  getCellValue(column: DataTableColumn, row: Record<string, unknown>) {
    const value = row[column.key];
    if (column.format) {
      return column.format(value, row);
    }
    return value ?? '—';
  }

  getBadgeVariant(column: DataTableColumn, row: Record<string, unknown>) {
    const value = String(row[column.key] ?? '').toLowerCase();
    return column.badgeMap?.[value] ?? 'neutral';
  }
}
