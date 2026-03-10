import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { TeamInvite, TeamMember } from '../models/team.model';
import { TableQuery, TableResult } from '../models/table.model';
import { applyTableQuery } from '../utils/table.utils';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private readonly members: TeamMember[] = [
    {
      id: 'mem-1',
      name: 'Amina Saleh',
      email: 'amina@saaskit.com',
      role: 'owner',
      status: 'active',
      lastActive: '2 min ago'
    },
    {
      id: 'mem-2',
      name: 'Omar Khaled',
      email: 'omar@saaskit.com',
      role: 'admin',
      status: 'active',
      lastActive: '1 hour ago'
    },
    {
      id: 'mem-3',
      name: 'Sara Ali',
      email: 'sara@saaskit.com',
      role: 'member',
      status: 'pending',
      lastActive: 'Yesterday'
    },
    {
      id: 'mem-4',
      name: 'Nour Tarek',
      email: 'nour@saaskit.com',
      role: 'member',
      status: 'inactive',
      lastActive: 'Mar 3'
    },
    {
      id: 'mem-5',
      name: 'Karim Ezz',
      email: 'karim@saaskit.com',
      role: 'viewer',
      status: 'active',
      lastActive: 'Today'
    },
    {
      id: 'mem-6',
      name: 'Maya Hassan',
      email: 'maya@saaskit.com',
      role: 'member',
      status: 'pending',
      lastActive: '2 days ago'
    }
  ];

  private readonly invitesSubject = new BehaviorSubject<TeamInvite[]>([]);
  readonly invites$ = this.invitesSubject.asObservable();

  getMembers(query: TableQuery): Observable<TableResult<TeamMember>> {
    const result = applyTableQuery(this.members, query, {
      searchFields: ['name', 'email', 'role', 'status'],
      filterFn: (member, filters) => {
        const roleFilter = filters['role'];
        const statusFilter = filters['status'];

        if (roleFilter && roleFilter !== 'all' && member.role !== roleFilter) {
          return false;
        }

        if (statusFilter && statusFilter !== 'all' && member.status !== statusFilter) {
          return false;
        }

        return true;
      }
    });

    return of(result).pipe(delay(300));
  }

  getMembersExport(query: TableQuery): Observable<TeamMember[]> {
    const exportQuery: TableQuery = {
      ...query,
      page: 1,
      pageSize: this.members.length
    };
    const result = applyTableQuery(this.members, exportQuery, {
      searchFields: ['name', 'email', 'role', 'status'],
      filterFn: (member, filters) => {
        const roleFilter = filters['role'];
        const statusFilter = filters['status'];

        if (roleFilter && roleFilter !== 'all' && member.role !== roleFilter) {
          return false;
        }

        if (statusFilter && statusFilter !== 'all' && member.status !== statusFilter) {
          return false;
        }

        return true;
      }
    });

    return of(result.items).pipe(delay(150));
  }

  getInvites(): Observable<TeamInvite[]> {
    return this.invites$.pipe(delay(200));
  }

  sendInvite(email: string, role: TeamInvite['role']): Observable<TeamInvite> {
    const invite: TeamInvite = {
      id: `inv-${Date.now()}`,
      email,
      role,
      invitedAt: 'Just now'
    };

    this.invitesSubject.next([invite, ...this.invitesSubject.value]);

    return of(invite).pipe(delay(300));
  }

  getRoleOptions() {
    return ['owner', 'admin', 'member', 'viewer'] as const;
  }
}
