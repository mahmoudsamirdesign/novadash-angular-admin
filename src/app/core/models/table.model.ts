export type SortDirection = 'asc' | 'desc';

export interface TableSort {
  field: string;
  direction: SortDirection;
}

export interface TableQuery {
  page: number;
  pageSize: number;
  search?: string;
  sort?: TableSort;
  filters?: Record<string, string | undefined>;
}

export interface TableResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
