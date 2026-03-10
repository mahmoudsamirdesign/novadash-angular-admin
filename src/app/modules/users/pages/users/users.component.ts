import { Component, DestroyRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UiCardComponent } from '../../../../shared/ui/card/ui-card.component';
import { UiButtonComponent } from '../../../../shared/ui/button/ui-button.component';
import { UiDataTableComponent, DataTableColumn } from '../../../../shared/ui/data-table/ui-data-table.component';
import { UiLoadingComponent } from '../../../../shared/ui/loading/ui-loading.component';
import { TableToolbarFilter, UiTableToolbarComponent } from '../../../../shared/ui/table-toolbar/ui-table-toolbar.component';
import { UiTablePaginationComponent } from '../../../../shared/ui/table-pagination/ui-table-pagination.component';
import { UsersService } from '../../../../core/services/users.service';
import { TableQuery, TableResult } from '../../../../core/models/table.model';
import { User, UserStats } from '../../../../core/models/user.model';
import { ToastService } from '../../../../core/services/toast.service';
import { exportTableToCsv } from '../../../../core/utils/export.utils';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    UiCardComponent,
    UiButtonComponent,
    UiDataTableComponent,
    UiLoadingComponent,
    UiTableToolbarComponent,
    UiTablePaginationComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  private readonly usersService = inject(UsersService);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  isLoading = true;
  isStatsLoading = true;
  stats: UserStats | null = null;
  result: TableResult<User> | null = null;

  statusOptions = ['all', ...this.usersService.getStatusOptions()];
  roleOptions = ['all', 'owner', 'admin', 'member', 'viewer'];

  query: TableQuery = {
    page: 1,
    pageSize: 5,
    search: '',
    filters: {
      status: 'all',
      role: 'all'
    }
  };

  columns: DataTableColumn[] = [
    { key: 'name', label: 'User' },
    {
      key: 'role',
      label: 'Role',
      format: value => this.formatLabel(value)
    },
    { key: 'team', label: 'Team' },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      badgeMap: {
        active: 'success',
        pending: 'warning',
        inactive: 'danger'
      },
      format: value => this.formatLabel(value)
    },
    { key: 'lastActive', label: 'Last active', align: 'right' }
  ];

  constructor() {
    this.loadStats();
    this.loadUsers();
  }

  loadStats() {
    this.isStatsLoading = true;
    this.usersService
      .getStats()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(stats => {
        this.stats = stats;
        this.isStatsLoading = false;
      });
  }

  loadUsers() {
    this.isLoading = true;
    this.usersService
      .getUsers(this.query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        this.result = result;
        this.isLoading = false;
      });
  }

  updateSearch(value: string) {
    this.query = { ...this.query, page: 1, search: value };
    this.loadUsers();
  }

  updateFilter(key: string, value: string) {
    this.query = {
      ...this.query,
      page: 1,
      filters: { ...this.query.filters, [key]: value }
    };
    this.loadUsers();
  }

  updatePagination(event: { page: number; pageSize: number }) {
    this.query = { ...this.query, page: event.page, pageSize: event.pageSize };
    this.loadUsers();
  }

  inviteUser() {
    this.toastService.show({
      title: 'Invite ready',
      message: 'Connect your auth provider to send invitations.',
      variant: 'info'
    });
  }

  exportUsers() {
    this.usersService
      .getUsersExport(this.query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(rows => {
        if (!rows.length) {
          this.toastService.show({
            title: 'No users to export',
            message: 'Adjust your filters to export results.',
            variant: 'info'
          });
          return;
        }
        exportTableToCsv('workspace-users', this.columns, rows);
        this.toastService.show({
          title: 'Export ready',
          message: 'Your CSV download has started.',
          variant: 'success'
        });
      });
  }

  get tableFilters(): TableToolbarFilter[] {
    return [
      {
        key: 'status',
        label: 'statuses',
        options: this.statusOptions,
        value: this.query.filters?.['status']
      },
      {
        key: 'role',
        label: 'roles',
        options: this.roleOptions,
        value: this.query.filters?.['role']
      }
    ];
  }

  private formatLabel(value: unknown) {
    if (!value) {
      return '—';
    }
    const label = String(value);
    return label.charAt(0).toUpperCase() + label.slice(1);
  }
}
