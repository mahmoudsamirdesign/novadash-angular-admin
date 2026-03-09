import { Component, DestroyRef, inject } from '@angular/core';
import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UiCardComponent } from '../../../../shared/ui/card/ui-card.component';
import { UiButtonComponent } from '../../../../shared/ui/button/ui-button.component';
import { UiDataTableComponent, DataTableColumn } from '../../../../shared/ui/data-table/ui-data-table.component';
import { UiModalComponent } from '../../../../shared/ui/modal/ui-modal.component';
import { UiFieldComponent } from '../../../../shared/ui/field/ui-field.component';
import { UiEmptyStateComponent } from '../../../../shared/ui/empty-state/ui-empty-state.component';
import { UiBadgeComponent } from '../../../../shared/ui/badge/ui-badge.component';
import { UiLoadingComponent } from '../../../../shared/ui/loading/ui-loading.component';
import { UiTablePaginationComponent } from '../../../../shared/ui/table-pagination/ui-table-pagination.component';
import { ToastService } from '../../../../core/services/toast.service';
import { TeamService } from '../../../../core/services/team.service';
import { AuthService } from '../../../../core/services/auth.service';
import { TableQuery, TableResult } from '../../../../core/models/table.model';
import { TeamInvite, TeamMember } from '../../../../core/models/team.model';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    TitleCasePipe,
    FormsModule,
    ReactiveFormsModule,
    UiCardComponent,
    UiButtonComponent,
    UiDataTableComponent,
    UiModalComponent,
    UiFieldComponent,
    UiEmptyStateComponent,
    UiBadgeComponent,
    UiLoadingComponent,
    UiTablePaginationComponent
  ],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss'
})
export class TeamComponent {
  inviteModalOpen = false;
  isLoadingMembers = true;
  canInvite = false;

  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private teamService = inject(TeamService);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  membersResult: TableResult<TeamMember> | null = null;
  invites: TeamInvite[] = [];

  roleOptions = ['all', ...this.teamService.getRoleOptions()];
  statusOptions = ['all', 'active', 'pending', 'inactive'];

  query: TableQuery = {
    page: 1,
    pageSize: 5,
    search: '',
    filters: {
      role: 'all',
      status: 'all'
    }
  };

  inviteForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['member', [Validators.required]]
  });

  columns: DataTableColumn[] = [
    { key: 'name', label: 'Member' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      format: value => this.formatLabel(value)
    },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      badgeMap: { active: 'success', pending: 'warning', inactive: 'danger' },
      format: value => this.formatLabel(value)
    },
    { key: 'lastActive', label: 'Last active', align: 'right' }
  ];

  constructor() {
    this.canInvite = this.authService.hasRole(['owner', 'admin']);
    this.loadMembers();
    this.loadInvites();
  }

  loadMembers() {
    this.isLoadingMembers = true;
    this.teamService
      .getMembers(this.query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        this.membersResult = result;
        this.isLoadingMembers = false;
      });
  }

  loadInvites() {
    this.teamService
      .getInvites()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(invites => {
        this.invites = invites;
      });
  }

  updateSearch(value: string) {
    this.query = { ...this.query, page: 1, search: value };
    this.loadMembers();
  }

  updateFilter(key: 'role' | 'status', value: string) {
    this.query = {
      ...this.query,
      page: 1,
      filters: { ...this.query.filters, [key]: value }
    };
    this.loadMembers();
  }

  updatePagination(event: { page: number; pageSize: number }) {
    this.query = { ...this.query, page: event.page, pageSize: event.pageSize };
    this.loadMembers();
  }

  openInviteModal() {
    if (!this.canInvite) {
      return;
    }
    this.inviteModalOpen = true;
  }

  closeInviteModal() {
    this.inviteModalOpen = false;
    this.inviteForm.reset({ role: 'member' });
  }

  sendInvite() {
    if (this.inviteForm.invalid) {
      this.inviteForm.markAllAsTouched();
      return;
    }

    const { email, role } = this.inviteForm.value;
    if (!email || !role) {
      return;
    }

    const allowedRoles = this.teamService.getRoleOptions();
    if (!allowedRoles.includes(role as TeamInvite['role'])) {
      return;
    }

    this.teamService
      .sendInvite(email, role as TeamInvite['role'])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.toastService.show({
          title: 'Invite sent',
          message: 'Your teammate will receive an email shortly.',
          variant: 'success'
        });
        this.closeInviteModal();
      });
  }

  resendInvite(invite: TeamInvite) {
    if (!this.canInvite) {
      return;
    }
    this.toastService.show({
      title: 'Invite resent',
      message: `Resent invitation to ${invite.email}.`,
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
