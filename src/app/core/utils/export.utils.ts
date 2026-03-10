import { DataTableColumn } from '../../shared/ui/data-table/ui-data-table.component';

export interface CsvColumn {
  key: string;
  label: string;
  format?: (value: unknown, row: Record<string, unknown>) => string;
}

export function exportTableToCsv(
  filename: string,
  columns: DataTableColumn[],
  rows: Record<string, unknown>[]
) {
  const csvColumns: CsvColumn[] = columns.map(column => ({
    key: column.key,
    label: column.label,
    format: column.format
  }));
  exportToCsv(filename, rows, csvColumns);
}

export function exportToCsv(
  filename: string,
  rows: Record<string, unknown>[],
  columns: CsvColumn[]
) {
  if (typeof document === 'undefined') {
    return;
  }

  const header = columns.map(column => escapeCsvValue(column.label)).join(',');
  const body = rows.map(row => {
    return columns
      .map(column => {
        const raw = row[column.key];
        const value = column.format ? column.format(raw, row) : raw;
        return escapeCsvValue(value ?? '');
      })
      .join(',');
  });

  const csvContent = [header, ...body].join('\n');
  const blob = new Blob([`\ufeff${csvContent}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function escapeCsvValue(value: unknown) {
  const text = String(value ?? '');
  const escaped = text.replace(/"/g, '""');
  if (/[",\n]/.test(escaped)) {
    return `"${escaped}"`;
  }
  return escaped;
}
