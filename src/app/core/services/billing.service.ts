import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { BillingPlan, BillingSummary, Invoice, PaymentMethod, UsageMetric } from '../models/billing.model';
import { TableQuery, TableResult } from '../models/table.model';
import { applyTableQuery } from '../utils/table.utils';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  private readonly plans: BillingPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$39 / month',
      billingCycle: 'Monthly',
      renewal: 'Renews on Apr 18, 2026',
      description: 'For solo founders and MVPs.',
      limits: [
        { label: 'Team members', value: 'Up to 5' },
        { label: 'Projects', value: '10 active' },
        { label: 'Storage', value: '25 GB' },
        { label: 'Automations', value: '1 workflow' }
      ]
    },
    {
      id: 'growth',
      name: 'Growth',
      price: '$79 / month',
      billingCycle: 'Monthly',
      renewal: 'Renews on Apr 18, 2026',
      description: 'Best for scaling teams.',
      limits: [
        { label: 'Team members', value: 'Up to 40' },
        { label: 'Projects', value: 'Unlimited' },
        { label: 'Storage', value: '100 GB' },
        { label: 'Automations', value: '10 workflows' }
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      billingCycle: 'Annual',
      renewal: 'Renews on Apr 18, 2026',
      description: 'Security, SSO, and SLAs.',
      limits: [
        { label: 'Team members', value: 'Unlimited' },
        { label: 'Projects', value: 'Unlimited' },
        { label: 'Storage', value: '500 GB+' },
        { label: 'Automations', value: 'Unlimited' }
      ]
    }
  ];

  private readonly paymentMethod: PaymentMethod = {
    brand: 'Visa',
    last4: '2044',
    expiry: '08/27',
    contactEmail: 'billing@saaskit.com'
  };

  private readonly usageMetrics: UsageMetric[] = [
    { label: 'Team members', value: '24 / 40' },
    { label: 'Active projects', value: '12 / 20' },
    { label: 'Storage used', value: '64 GB / 100 GB' }
  ];

  private readonly invoices: Invoice[] = [
    { id: 'INV-3241', date: 'Mar 01, 2026', amount: '$79.00', status: 'paid' },
    { id: 'INV-3194', date: 'Feb 01, 2026', amount: '$79.00', status: 'paid' },
    { id: 'INV-3128', date: 'Jan 01, 2026', amount: '$79.00', status: 'paid' },
    { id: 'INV-3075', date: 'Dec 01, 2025', amount: '$79.00', status: 'paid' },
    { id: 'INV-3011', date: 'Nov 01, 2025', amount: '$79.00', status: 'pending' },
    { id: 'INV-2956', date: 'Oct 01, 2025', amount: '$79.00', status: 'failed' }
  ];

  private readonly currentPlanId = new BehaviorSubject<string>('growth');

  getSummary(): Observable<BillingSummary> {
    return this.currentPlanId.pipe(
      map(planId => {
        const currentPlan = this.plans.find(plan => plan.id === planId) ?? this.plans[1];
        return {
          currentPlan,
          plans: this.plans,
          paymentMethod: this.paymentMethod,
          usage: this.usageMetrics,
          invoices: this.invoices
        };
      }),
      delay(300)
    );
  }

  getInvoices(query: TableQuery): Observable<TableResult<Invoice>> {
    const result = applyTableQuery(this.invoices, query, {
      searchFields: ['id', 'date', 'amount', 'status'],
      filterFn: (invoice, filters) => {
        const statusFilter = filters['status'];
        if (statusFilter && statusFilter !== 'all' && invoice.status !== statusFilter) {
          return false;
        }
        return true;
      }
    });

    return of(result).pipe(delay(200));
  }

  changePlan(planId: string): Observable<BillingPlan> {
    this.currentPlanId.next(planId);
    const plan = this.plans.find(item => item.id === planId) ?? this.plans[0];
    return of(plan).pipe(delay(200));
  }

  refreshUsage(): Observable<UsageMetric[]> {
    return of(this.usageMetrics).pipe(delay(600));
  }
}
