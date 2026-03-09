export type InvoiceStatus = 'paid' | 'pending' | 'failed';

export interface BillingPlan {
  id: string;
  name: string;
  price: string;
  billingCycle: string;
  renewal: string;
  description: string;
  limits: PlanLimit[];
}

export interface PlanLimit {
  label: string;
  value: string;
}

export interface PaymentMethod {
  brand: string;
  last4: string;
  expiry: string;
  contactEmail: string;
}

export interface UsageMetric {
  label: string;
  value: string;
}

export interface Invoice extends Record<string, unknown> {
  id: string;
  date: string;
  amount: string;
  status: InvoiceStatus;
}

export interface BillingSummary {
  currentPlan: BillingPlan;
  plans: BillingPlan[];
  paymentMethod: PaymentMethod;
  usage: UsageMetric[];
  invoices: Invoice[];
}
