import { Component, DestroyRef, inject } from '@angular/core';
import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UiCardComponent } from '../../../../shared/ui/card/ui-card.component';
import { UiButtonComponent } from '../../../../shared/ui/button/ui-button.component';
import { UiBadgeComponent } from '../../../../shared/ui/badge/ui-badge.component';
import { UiLoadingComponent } from '../../../../shared/ui/loading/ui-loading.component';
import { UiEmptyStateComponent } from '../../../../shared/ui/empty-state/ui-empty-state.component';
import { UiErrorStateComponent } from '../../../../shared/ui/error-state/ui-error-state.component';
import { TableToolbarFilter, UiTableToolbarComponent } from '../../../../shared/ui/table-toolbar/ui-table-toolbar.component';
import { UiTablePaginationComponent } from '../../../../shared/ui/table-pagination/ui-table-pagination.component';
import { ToastService } from '../../../../core/services/toast.service';
import { ActivityService } from '../../../../core/services/activity.service';
import { ActivityItem, ActivityFilter } from '../../../../core/models/activity.model';
import { TableQuery, TableResult } from '../../../../core/models/table.model';
import { exportToCsv } from '../../../../core/utils/export.utils';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    TitleCasePipe,
    FormsModule,
    UiCardComponent,
    UiButtonComponent,
    UiBadgeComponent,
    UiLoadingComponent,
    UiEmptyStateComponent,
    UiErrorStateComponent,
    UiTableToolbarComponent,
    UiTablePaginationComponent
  ],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss'
})
export class ActivityComponent {
  isLoading = true;
  hasError = false;

  private readonly activityService = inject(ActivityService);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  result: TableResult<ActivityItem> | null = null;

  typeOptions: ActivityFilter[] = this.activityService.getTypes();

  query: TableQuery = {
    page: 1,
    pageSize: 6,
    search: '',
    filters: {
      type: 'all'
    }
  };

  constructor() {
    this.loadActivities();
  }

  refresh() {
    this.loadActivities(true);
  }

  exportLog() {
    this.activityService
      .getActivitiesExport(this.query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(rows => {
        if (!rows.length) {
          this.toastService.show({
            title: 'No activity to export',
            message: 'Adjust your filters to export results.',
            variant: 'info'
          });
          return;
        }
        exportToCsv('activity-log', rows, [
          { key: 'title', label: 'Event' },
          { key: 'meta', label: 'Details' },
          { key: 'type', label: 'Type', format: value => this.formatLabel(value) }
        ]);
        this.toastService.show({
          title: 'Export ready',
          message: 'Your CSV download has started.',
          variant: 'success'
        });
      });
  }

  retry() {
    this.hasError = false;
    this.loadActivities();
  }

  badgeVariant(type: ActivityItem['type']) {
    switch (type) {
      case 'security':
        return 'warning';
      case 'billing':
        return 'success';
      case 'team':
        return 'info';
      default:
        return 'neutral';
    }
  }

  updateSearch(value: string) {
    this.query = { ...this.query, page: 1, search: value };
    this.loadActivities();
  }

  updateFilter(key: string, value: string) {
    if (key !== 'type') {
      return;
    }
    this.query = { ...this.query, page: 1, filters: { ...this.query.filters, type: value as ActivityFilter } };
    this.loadActivities();
  }

  updatePagination(event: { page: number; pageSize: number }) {
    this.query = { ...this.query, page: event.page, pageSize: event.pageSize };
    this.loadActivities();
  }

  get tableFilters(): TableToolbarFilter[] {
    return [
      {
        key: 'type',
        label: 'types',
        options: this.typeOptions,
        value: this.query.filters?.['type']
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

  private loadActivities(showToast = false) {
    this.isLoading = true;
    this.hasError = false;

    this.activityService
      .getActivities(this.query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: result => {
          this.result = result;
          this.isLoading = false;
          if (showToast) {
            this.toastService.show({
              title: 'Activity feed updated',
              message: 'Latest events have been synced.',
              variant: 'success'
            });
          }
        },
        error: () => {
          this.isLoading = false;
          this.hasError = true;
        }
      });
  }
}
