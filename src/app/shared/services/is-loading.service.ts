import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class IsLoadingService {
  private readonly counters = new Map<string, number>();
  private readonly loadingState = new BehaviorSubject<Map<string, number>>(new Map());

  public async add<T>(operation: Promise<T>, key: string = 'default'): Promise<T> {
    this.updateCounter(key, 1);
    try {
      return await operation;
    } finally {
      this.updateCounter(key, -1);
    }
  }

  public isLoading$(key: string = 'default'): Observable<boolean> {
    return this.loadingState.asObservable().pipe(
      map((state) => (state.get(key) ?? 0) > 0)
    );
  }

  private updateCounter(key: string, delta: number): void {
    const nextValue = Math.max((this.counters.get(key) ?? 0) + delta, 0);
    if (nextValue === 0) {
      this.counters.delete(key);
    } else {
      this.counters.set(key, nextValue);
    }

    this.loadingState.next(new Map(this.counters));
  }
}
