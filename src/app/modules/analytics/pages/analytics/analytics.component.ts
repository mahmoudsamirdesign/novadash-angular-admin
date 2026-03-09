import { AfterViewInit, Component, DestroyRef, ViewChild, inject } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { UiCardComponent } from '../../../../shared/ui/card/ui-card.component';
import { ThemeService } from '../../../../core/services/theme.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [BaseChartDirective, UiCardComponent],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent implements AfterViewInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  private readonly themeService = inject(ThemeService);
  private readonly destroyRef = inject(DestroyRef);

  barChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [120, 190, 160, 210, 260, 240, 300],
        label: 'Active sessions',
        backgroundColor: '#60a5fa',
        borderRadius: 8
      }
    ]
  };

  barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8' },
        grid: { display: false }
      },
      y: {
        ticks: { color: '#94a3b8' },
        grid: { color: '#e2e8f0' }
      }
    }
  };

  constructor() {
    this.themeService.theme$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.applyChartTheme());
  }

  ngAfterViewInit() {
    this.applyChartTheme();
  }

  private applyChartTheme() {
    const primary = this.themeService.getCssVar('--color-primary') || '#60a5fa';
    const muted = this.themeService.getCssVar('--color-muted') || '#94a3b8';
    const grid = this.themeService.getCssVar('--color-border-subtle') || '#e2e8f0';

    this.barChartData.datasets[0].backgroundColor = primary;

    this.barChartOptions = {
      ...this.barChartOptions,
      scales: {
        x: { ticks: { color: muted }, grid: { display: false } },
        y: { ticks: { color: muted }, grid: { color: grid } }
      }
    };

    this.chart?.update();
  }
}
