import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastVariant = 'success' | 'info' | 'warning' | 'error';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  variant?: ToastVariant;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  readonly toasts$ = this.toastsSubject.asObservable();
  private timers = new Map<string, ReturnType<typeof setTimeout>>();

  show(toast: Omit<ToastMessage, 'id'>) {
    const id = this.createId();
    const message: ToastMessage = { id, variant: 'info', duration: 3500, ...toast };
    this.toastsSubject.next([...this.toastsSubject.value, message]);

    if (message.duration && message.duration > 0) {
      const timer = setTimeout(() => this.dismiss(id), message.duration);
      this.timers.set(id, timer);
    }

    return id;
  }

  dismiss(id: string) {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }

    this.toastsSubject.next(this.toastsSubject.value.filter(toast => toast.id !== id));
  }

  clear() {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    this.toastsSubject.next([]);
  }

  private createId() {
    return `toast_${Math.random().toString(36).slice(2)}_${Date.now()}`;
  }
}
