import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { UiButtonComponent } from '../button/ui-button.component';

@Component({
  selector: 'ui-table-pagination',
  standalone: true,
  imports: [NgFor, NgIf, UiButtonComponent],
  templateUrl: './ui-table-pagination.component.html',
  styleUrl: './ui-table-pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiTablePaginationComponent {
  @Input() page = 1;
  @Input() pageSize = 10;
  @Input() total = 0;
  @Input() pageSizeOptions: number[] = [5, 10, 20];

  @Output() pageChange = new EventEmitter<{ page: number; pageSize: number }>();

  get totalPages() {
    return Math.max(Math.ceil(this.total / this.pageSize), 1);
  }

  get rangeStart() {
    return this.total === 0 ? 0 : (this.page - 1) * this.pageSize + 1;
  }

  get rangeEnd() {
    return Math.min(this.page * this.pageSize, this.total);
  }

  prev() {
    if (this.page > 1) {
      this.pageChange.emit({ page: this.page - 1, pageSize: this.pageSize });
    }
  }

  next() {
    if (this.page < this.totalPages) {
      this.pageChange.emit({ page: this.page + 1, pageSize: this.pageSize });
    }
  }

  changePageSize(size: number) {
    this.pageChange.emit({ page: 1, pageSize: size });
  }
}
