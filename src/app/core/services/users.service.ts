import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User, UserStats, UserStatus } from '../models/user.model';
import { TableQuery, TableResult } from '../models/table.model';
import { applyTableQuery } from '../utils/table.utils';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly users: User[] = [
    {
      id: 'usr-1',
      name: 'Amina Saleh',
      email: 'amina@saaskit.com',
      role: 'owner',
      team: 'Executive',
      status: 'active',
      lastActive: '2 min ago'
    },
    {
      id: 'usr-2',
      name: 'Omar Khaled',
      email: 'omar@saaskit.com',
      role: 'admin',
      team: 'Growth',
      status: 'active',
      lastActive: '1 hour ago'
    },
    {
      id: 'usr-3',
      name: 'Sara Ali',
      email: 'sara@saaskit.com',
      role: 'member',
      team: 'Ops',
      status: 'pending',
      lastActive: 'Yesterday'
    },
    {
      id: 'usr-4',
      name: 'Nour Tarek',
      email: 'nour@saaskit.com',
      role: 'member',
      team: 'CX',
      status: 'inactive',
      lastActive: 'Mar 3'
    },
    {
      id: 'usr-5',
      name: 'Farah Ibrahim',
      email: 'farah@saaskit.com',
      role: 'viewer',
      team: 'Finance',
      status: 'active',
      lastActive: '3 hours ago'
    },
    {
      id: 'usr-6',
      name: 'Youssef Adel',
      email: 'youssef@saaskit.com',
      role: 'member',
      team: 'Product',
      status: 'active',
      lastActive: 'Today'
    },
    {
      id: 'usr-7',
      name: 'Laila Mostafa',
      email: 'laila@saaskit.com',
      role: 'admin',
      team: 'People',
      status: 'pending',
      lastActive: 'Mar 1'
    }
  ];

  getStats(): Observable<UserStats> {
    const total = this.users.length;
    const activeToday = this.users.filter(user => user.status === 'active').length;
    const pendingInvites = this.users.filter(user => user.status === 'pending').length;

    return of({ total, activeToday, pendingInvites }).pipe(delay(200));
  }

  getUsers(query: TableQuery): Observable<TableResult<User>> {
    const result = applyTableQuery(this.users, query, {
      searchFields: ['name', 'email', 'role', 'team', 'status'],
      filterFn: (user, filters) => {
        const statusFilter = filters['status'];
        const roleFilter = filters['role'];

        if (statusFilter && statusFilter !== 'all' && user.status !== statusFilter) {
          return false;
        }

        if (roleFilter && roleFilter !== 'all' && user.role !== roleFilter) {
          return false;
        }

        return true;
      }
    });

    return of(result).pipe(delay(300));
  }

  getStatusOptions(): UserStatus[] {
    return ['active', 'pending', 'inactive'];
  }
}
