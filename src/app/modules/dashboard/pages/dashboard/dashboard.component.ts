import { AfterViewInit, Component, DestroyRef, ViewChild, inject } from '@angular/core';
import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThemeService } from '../../../../core/services/theme.service';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { DashboardActivity, DashboardCustomer, DashboardStat } from '../../../../core/models/dashboard.model';
import { UiLoadingComponent } from '../../../../shared/ui/loading/ui-loading.component';
import { UiEmptyStateComponent } from '../../../../shared/ui/empty-state/ui-empty-state.component';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, NgFor, TitleCasePipe, BaseChartDirective, UiLoadingComponent, UiEmptyStateComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements AfterViewInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  private readonly themeService = inject(ThemeService);
  private readonly dashboardService = inject(DashboardService);
  private readonly destroyRef = inject(DestroyRef);

  isLoading = true;
  stats: DashboardStat[] = [];
  activities: DashboardActivity[] = [];
  customers: DashboardCustomer[] = [];

  lineChartData = {
    labels: [] as string[],
    datasets: [
      {
        data: [] as number[],
        label: 'Revenue',
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96, 165, 250, 0.15)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#60a5fa',
        pointBorderColor: '#60a5fa',
        pointHoverBackgroundColor: '#93c5fd',
        pointHoverBorderColor: '#93c5fd'
      }
    ]
  };

  lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#94a3b8'
        }
      },
      tooltip: {
        titleColor: '#f9fafb',
        bodyColor: '#e5e7eb'
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#94a3b8'
        },
        grid: {
          color: '#e2e8f0'
        }
      },
      y: {
        ticks: {
          color: '#94a3b8'
        },
        grid: {
          color: '#e2e8f0'
        }
      }
    }
  };

  constructor() {
    this.themeService.theme$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.applyChartTheme());

    this.dashboardService
      .getSummary()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(summary => {
        this.stats = summary.stats;
        this.activities = summary.activities;
        this.customers = summary.customers;
        this.lineChartData.labels = summary.chart.labels;
        this.lineChartData.datasets[0].data = summary.chart.data;
        this.isLoading = false;
        this.applyChartTheme();
      });
  }

  ngAfterViewInit() {
    this.applyChartTheme();
  }

  private applyChartTheme() {
    const primary = this.themeService.getCssVar('--color-primary') || '#60a5fa';
    const muted = this.themeService.getCssVar('--color-muted') || '#94a3b8';
    const grid = this.themeService.getCssVar('--color-border-subtle') || '#e2e8f0';

    const dataset = this.lineChartData.datasets[0];
    dataset.borderColor = primary;
    dataset.pointBackgroundColor = primary;
    dataset.pointBorderColor = primary;
    dataset.pointHoverBackgroundColor = primary;
    dataset.pointHoverBorderColor = primary;
    dataset.backgroundColor = this.toRgba(primary, 0.18);

    this.lineChartOptions = {
      ...this.lineChartOptions,
      plugins: {
        ...this.lineChartOptions.plugins,
        legend: {
          ...(this.lineChartOptions.plugins as any).legend,
          labels: { color: muted }
        }
      },
      scales: {
        x: {
          ticks: { color: muted },
          grid: { color: grid }
        },
        y: {
          ticks: { color: muted },
          grid: { color: grid }
        }
      }
    };

    this.chart?.update();
  }

  private toRgba(hexColor: string, alpha: number) {
    const hex = hexColor.replace('#', '');
    if (hex.length !== 6) {
      return `rgba(96, 165, 250, ${alpha})`;
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}
