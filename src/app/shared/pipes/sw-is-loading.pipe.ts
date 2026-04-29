import {Pipe, PipeTransform} from '@angular/core';
import {Observable} from 'rxjs';
import {IsLoadingService} from '../services/is-loading.service';

@Pipe({
  name: 'swIsLoading',
  standalone: true,
})
export class SwIsLoadingPipe implements PipeTransform {
  constructor(private readonly isLoadingService: IsLoadingService) {
  }

  public transform(key: string = 'default'): Observable<boolean> {
    return this.isLoadingService.isLoading$(key);
  }
}
