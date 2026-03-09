import { TableQuery, TableResult, TableSort } from '../models/table.model';

export interface TableQueryOptions<T> {
  searchFields?: Array<keyof T>;
  filterFn?: (item: T, filters: Record<string, string | undefined>) => boolean;
  sortFn?: (a: T, b: T, sort: TableSort) => number;
}

export function applyTableQuery<T>(
  items: T[],
  query: TableQuery,
  options: TableQueryOptions<T> = {}
): TableResult<T> {
  let filtered = [...items];

  if (query.search && options.searchFields?.length) {
    const term = query.search.toLowerCase();
    filtered = filtered.filter(item =>
      options.searchFields!.some(field =>
        String(item[field] ?? '').toLowerCase().includes(term)
      )
    );
  }

  if (query.filters && options.filterFn) {
    filtered = filtered.filter(item => options.filterFn!(item, query.filters!));
  }

  if (query.sort && options.sortFn) {
    filtered = filtered.sort((a, b) => options.sortFn!(a, b, query.sort!));
  }

  const total = filtered.length;
  const page = Math.max(query.page, 1);
  const pageSize = Math.max(query.pageSize, 1);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    items: filtered.slice(start, end),
    total,
    page,
    pageSize
  };
}
