import { Component, DestroyRef, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UiCardComponent } from '../../../../shared/ui/card/ui-card.component';
import { UiButtonComponent } from '../../../../shared/ui/button/ui-button.component';
import { UiBadgeComponent } from '../../../../shared/ui/badge/ui-badge.component';
import { UiDataTableComponent, DataTableColumn } from '../../../../shared/ui/data-table/ui-data-table.component';
import { UiModalComponent } from '../../../../shared/ui/modal/ui-modal.component';
import { UiLoadingComponent } from '../../../../shared/ui/loading/ui-loading.component';
import { TableToolbarFilter, UiTableToolbarComponent } from '../../../../shared/ui/table-toolbar/ui-table-toolbar.component';
import { UiTablePaginationComponent } from '../../../../shared/ui/table-pagination/ui-table-pagination.component';
import { UiFieldComponent } from '../../../../shared/ui/field/ui-field.component';
import { ToastService } from '../../../../core/services/toast.service';
import { BillingService } from '../../../../core/services/billing.service';
import { AuthService } from '../../../../core/services/auth.service';
import { BillingSummary, Invoice } from '../../../../core/models/billing.model';
import { TableQuery, TableResult } from '../../../../core/models/table.model';
import { exportTableToCsv } from '../../../../core/utils/export.utils';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    UiCardComponent,
    UiButtonComponent,
    UiBadgeComponent,
    UiDataTableComponent,
    UiModalComponent,
    UiLoadingComponent,
    UiTableToolbarComponent,
    UiTablePaginationComponent,
    UiFieldComponent
  ],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss'
})
export class BillingComponent {
  isPlanModalOpen = false;
  isPlanDetailsOpen = false;
  isCardModalOpen = false;
  isUsageLoading = false;
  isLoadingSummary = true;
  isLoadingInvoices = true;
  canManageBilling = false;
  isSavingCard = false;

  private readonly fb = inject(FormBuilder);
  private readonly billingService = inject(BillingService);
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  summary: BillingSummary | null = null;
  downloadToastId: string | null = null;
  private downloadToastTimer: ReturnType<typeof setTimeout> | null = null;

  invoiceResult: TableResult<Invoice> | null = null;

  statusOptions = ['all', 'paid', 'pending', 'failed'];
  statusLabels: Record<string, string> = {
    paid: 'Paid',
    pending: 'Pending',
    failed: 'Failed'
  };

  query: TableQuery = {
    page: 1,
    pageSize: 5,
    search: '',
    filters: {
      status: 'all'
    }
  };

  cardForm = this.fb.group({
    cardholderName: ['', [Validators.required, Validators.minLength(2)]],
    cardNumber: ['', [Validators.required, Validators.minLength(12)]],
    expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/?\d{2}$/)]],
    cvc: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]]
  });

  invoiceColumns: DataTableColumn[] = [
    { key: 'id', label: 'Invoice' },
    { key: 'date', label: 'Date' },
    { key: 'amount', label: 'Amount', align: 'right' },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      badgeMap: {
        paid: 'success',
        pending: 'warning',
        failed: 'danger'
      },
      format: value => {
        const label = this.statusLabels[String(value ?? '').toLowerCase()];
        return label ?? String(value ?? '—');
      }
    }
  ];

  constructor() {
    this.canManageBilling = this.authService.hasRole(['owner', 'admin']);
    this.loadSummary();
    this.loadInvoices();
  }

  loadSummary() {
    this.isLoadingSummary = true;
    this.billingService
      .getSummary()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(summary => {
        this.summary = summary;
        this.isLoadingSummary = false;
      });
  }

  loadInvoices() {
    this.isLoadingInvoices = true;
    this.billingService
      .getInvoices(this.query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        this.invoiceResult = result;
        this.isLoadingInvoices = false;
      });
  }

  openPlanModal() {
    if (!this.canManageBilling) {
      return;
    }
    this.isPlanModalOpen = true;
  }

  closePlanModal() {
    this.isPlanModalOpen = false;
  }

  confirmPlanChange(planId: string) {
    this.billingService
      .changePlan(planId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(plan => {
        if (this.summary) {
          this.summary = { ...this.summary, currentPlan: plan };
        }
        this.closePlanModal();
        this.toastService.show({
          title: `Plan updated to ${plan.name}`,
          message: 'Your subscription will update on the next billing cycle.',
          variant: 'success'
        });
      });
  }

  viewPlanDetails() {
    this.isPlanDetailsOpen = true;
  }

  updateCard() {
    this.isCardModalOpen = true;
  }

  closePlanDetails() {
    this.isPlanDetailsOpen = false;
  }

  closeCardModal() {
    this.isCardModalOpen = false;
    this.cardForm.reset();
  }

  selectPlanFromDetails(planId: string) {
    if (!this.canManageBilling) {
      return;
    }
    this.confirmPlanChange(planId);
    this.closePlanDetails();
  }

  saveCard() {
    if (this.cardForm.invalid) {
      this.cardForm.markAllAsTouched();
      return;
    }

    this.isSavingCard = true;
    setTimeout(() => {
      this.isSavingCard = false;
      this.toastService.show({
        title: 'Payment method updated',
        message: 'Your card details have been securely saved.',
        variant: 'success'
      });
      this.closeCardModal();
    }, 700);
  }

  refreshUsage() {
    if (this.isLoadingSummary) {
      return;
    }
    this.isUsageLoading = true;
    this.billingService
      .refreshUsage()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(usage => {
        if (this.summary) {
          this.summary = { ...this.summary, usage };
        }
        this.isUsageLoading = false;
        this.toastService.show({
          title: 'Usage updated',
          message: 'Latest usage metrics are now available.',
          variant: 'success'
        });
      });
  }

  updateSearch(value: string) {
    this.query = { ...this.query, page: 1, search: value };
    this.loadInvoices();
  }

  updateFilter(key: string, value: string) {
    if (key !== 'status') {
      return;
    }
    this.query = { ...this.query, page: 1, filters: { ...this.query.filters, status: value } };
    this.loadInvoices();
  }

  updatePagination(event: { page: number; pageSize: number }) {
    this.query = { ...this.query, page: event.page, pageSize: event.pageSize };
    this.loadInvoices();
  }

  downloadInvoice() {
    if (this.downloadToastId) {
      return;
    }
    const id = this.toastService.show({
      title: 'Invoice download started',
      message: 'Your PDF will be ready shortly.',
      variant: 'info',
      duration: 2400
    });
    this.downloadToastId = id;

    if (this.downloadToastTimer) {
      clearTimeout(this.downloadToastTimer);
    }

    this.downloadToastTimer = setTimeout(() => {
      this.downloadToastId = null;
    }, 2600);
  }

  exportInvoices() {
    this.billingService
      .getInvoicesExport(this.query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(rows => {
        if (!rows.length) {
          this.toastService.show({
            title: 'No invoices to export',
            message: 'Adjust your filters to export results.',
            variant: 'info'
          });
          return;
        }
        exportTableToCsv('billing-invoices', this.invoiceColumns, rows);
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
      }
    ];
  }
}
