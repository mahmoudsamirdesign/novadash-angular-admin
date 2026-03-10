import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ActivityFilter, ActivityItem } from '../models/activity.model';
import { TableQuery, TableResult } from '../models/table.model';
import { applyTableQuery } from '../utils/table.utils';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private readonly activities: ActivityItem[] = [
    { id: 'act-1', title: 'Amina invited Omar to Growth team', meta: '2 min ago · Team', type: 'team' },
    { id: 'act-2', title: 'Invoice INV-3241 was paid', meta: '1 hour ago · Billing', type: 'billing' },
    { id: 'act-3', title: 'New feature flag enabled', meta: 'Today · Product', type: 'product' },
    { id: 'act-4', title: 'Login from new device detected', meta: 'Yesterday · Security', type: 'security' },
    { id: 'act-5', title: 'Password policy updated', meta: '2 days ago · Security', type: 'security' },
    { id: 'act-6', title: 'Maya accepted the team invite', meta: 'Mar 6 · Team', type: 'team' },
    { id: 'act-7', title: 'New usage report exported', meta: 'Mar 5 · Billing', type: 'billing' },
    { id: 'act-8', title: 'Integration with Slack enabled', meta: 'Mar 3 · Product', type: 'product' }
  ];

  getActivities(query: TableQuery): Observable<TableResult<ActivityItem>> {
    const result = applyTableQuery(this.activities, query, {
      searchFields: ['title', 'meta', 'type'],
      filterFn: (item, filters) => {
        const typeFilter = filters['type'];
        if (typeFilter && typeFilter !== 'all' && item.type !== typeFilter) {
          return false;
        }
        return true;
      }
    });

    return of(result).pipe(delay(300));
  }

  getActivitiesExport(query: TableQuery): Observable<ActivityItem[]> {
    const exportQuery: TableQuery = {
      ...query,
      page: 1,
      pageSize: this.activities.length
    };
    const result = applyTableQuery(this.activities, exportQuery, {
      searchFields: ['title', 'meta', 'type'],
      filterFn: (item, filters) => {
        const typeFilter = filters['type'];
        if (typeFilter && typeFilter !== 'all' && item.type !== typeFilter) {
          return false;
        }
        return true;
      }
    });

    return of(result.items).pipe(delay(150));
  }

  getTypes(): ActivityFilter[] {
    return ['all', 'security', 'billing', 'team', 'product'];
  }
}
