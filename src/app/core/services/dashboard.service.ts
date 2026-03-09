import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DashboardSummary } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly summary: DashboardSummary = {
    stats: [
      { label: 'Total Revenue', value: '$24,560', change: '+12.5%', trend: 'positive' },
      { label: 'Active Users', value: '1,284', change: '+8.2%', trend: 'positive' },
      { label: 'New Signups', value: '356', change: '+5.4%', trend: 'positive' },
      { label: 'Churn Rate', value: '2.1%', change: '-1.1%', trend: 'negative' }
    ],
    activities: [
      { actor: 'Mahmoud', action: 'created a new project', time: '2 min ago' },
      { actor: 'Admin', action: 'updated subscription plan', time: '15 min ago' },
      { actor: 'Sarah', action: 'invited a team member', time: '1 hour ago' }
    ],
    customers: [
      { name: 'Ahmed Hassan', company: 'NovaTech', status: 'active', revenue: '$4,200' },
      { name: 'Sara Ali', company: 'Bright Lab', status: 'pending', revenue: '$2,180' },
      { name: 'Omar Khaled', company: 'PixelSoft', status: 'active', revenue: '$5,940' },
      { name: 'Nour Tarek', company: 'CloudAxis', status: 'inactive', revenue: '$980' }
    ],
    chart: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      data: [12000, 15000, 14000, 18000, 22000, 24000, 26000]
    }
  };

  getSummary(): Observable<DashboardSummary> {
    return of(this.summary).pipe(delay(300));
  }
}
