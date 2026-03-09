import { Component, DestroyRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UiCardComponent } from '../../../../shared/ui/card/ui-card.component';
import { UiButtonComponent } from '../../../../shared/ui/button/ui-button.component';
import { UiDataTableComponent, DataTableColumn } from '../../../../shared/ui/data-table/ui-data-table.component';
import { UiLoadingComponent } from '../../../../shared/ui/loading/ui-loading.component';
import { UiTablePaginationComponent } from '../../../../shared/ui/table-pagination/ui-table-pagination.component';
import { UsersService } from '../../../../core/services/users.service';
import { TableQuery, TableResult } from '../../../../core/models/table.model';
import { User, UserStats } from '../../../../core/models/user.model';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    FormsModule,
    NgFor,
    NgIf,
    TitleCasePipe,
    UiCardComponent,
    UiButtonComponent,
    UiDataTableComponent,
    UiLoadingComponent,
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

  updateFilter(key: 'status' | 'role', value: string) {
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
    this.toastService.show({
      title: 'Export queued',
      message: 'User export will be generated when a backend is connected.',
      variant: 'info'
    });
  }

  private formatLabel(value: unknown) {
    if (!value) {
      return '—';
    }
    const label = String(value);
    return label.charAt(0).toUpperCase() + label.slice(1);
  }
}
