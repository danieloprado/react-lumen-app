import { Observable, Subscriber, Subscription } from 'rxjs';

import { ICache } from '../interfaces/cache';
import { cacheService, logService } from '../services';

interface IOptions {
  refresh: boolean;
  persist: boolean;
  expirationMinutes: number;
}

function cache<T>(this: Observable<T>, key: string, options: Partial<IOptions> = {}): Observable<T> {
  const defaultOptions: IOptions = {
    refresh: false,
    persist: false,
    expirationMinutes: 5
  };

  return this.lift(new CacheOperator(key, { ...defaultOptions, ...options }));
}

Observable.prototype.cache = cache;

declare module 'rxjs/Observable' {
  // tslint:disable-next-line:interface-name
  interface Observable<T> { cache: typeof cache; }
}

class CacheOperator {
  constructor(
    private key: string,
    private options: IOptions
  ) { }

  public call(subscriber: Subscriber<any>, source: Observable<any>): Subscription {
    if (this.options.refresh) {
      return source
        .do(data => cacheService.saveData(this.key, data, this.options))
        .subscribe(subscriber);
    }

    let currentCache: ICache;
    return cacheService.getData(this.key)
      .switchMap(cache => {
        currentCache = cache;
        if (cache && !cacheService.isExpirated(cache)) {
          return Observable.of(cache.data);
        }

        return !cache ? source : source.startWith(cache.data);
      })
      .switchMap(data => {
        if (currentCache && currentCache.data === data) {
          logService.breadcrumb('Cache', 'manual', data);
          return Observable.of(data);
        }

        logService.breadcrumb('Cache Set', 'manual', data);
        return cacheService.saveData(this.key, data, this.options).map(() => data);
      })
      .subscribe(subscriber);
  }
}