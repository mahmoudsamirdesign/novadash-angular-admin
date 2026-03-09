# Component Usage Examples

These are minimal examples showing how to use the shared UI components in standalone pages.

## Button
```html
<ui-button>Primary</ui-button>
<ui-button variant="secondary">Secondary</ui-button>
<ui-button variant="ghost" [disabled]="true">Disabled</ui-button>
```

## Card
```html
<ui-card>
  <h3>Card title</h3>
  <p class="muted">Card content</p>
</ui-card>
```

## Data Table with Pagination
```ts
query: TableQuery = {
  page: 1,
  pageSize: 5,
  search: '',
  filters: { status: 'all' }
};

columns: DataTableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'status', label: 'Status', type: 'badge', badgeMap: { active: 'success' } }
];
```

```html
<ui-data-table [columns]="columns" [rows]="result?.items ?? []"></ui-data-table>
<ui-table-pagination
  [page]="result?.page ?? 1"
  [pageSize]="result?.pageSize ?? 5"
  [total]="result?.total ?? 0"
  (pageChange)="updatePagination($event)">
</ui-table-pagination>
```

## Modal
```html
<ui-modal [open]="isOpen" title="Modal title" (closed)="isOpen = false">
  <p>Modal content</p>
  <div modal-actions>
    <ui-button variant="ghost" (click)="isOpen = false">Cancel</ui-button>
    <ui-button>Confirm</ui-button>
  </div>
</ui-modal>
```

## Toasts
```ts
constructor(private toastService: ToastService) {}

showToast() {
  this.toastService.show({
    title: 'Success',
    message: 'Operation complete',
    variant: 'success'
  });
}
```

## Loading, Empty, and Error States
```html
<ui-loading title="Loading" message="Fetching data..."></ui-loading>
<ui-empty-state title="No data" message="Add your first item."></ui-empty-state>
<ui-error-state title="Error" message="Something went wrong."></ui-error-state>
```
