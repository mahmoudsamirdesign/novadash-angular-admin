export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  trend: 'positive' | 'negative';
}

export interface DashboardActivity {
  actor: string;
  action: string;
  time: string;
}

export interface DashboardCustomer {
  name: string;
  company: string;
  status: 'active' | 'pending' | 'inactive';
  revenue: string;
}

export interface DashboardSummary {
  stats: DashboardStat[];
  activities: DashboardActivity[];
  customers: DashboardCustomer[];
  chart: {
    labels: string[];
    data: number[];
  };
}
