import moment from 'moment';
import { Observable } from 'rxjs';

import * as storageService from './storage';
import { ICache } from '../interfaces/cache';

const memory: { [key: string]: ICache } = {};

export function getData(key: string): Observable<ICache> {
  if (memory[key]) return Observable.of(memory[key]);
  return storageService.get('react-cache' + key);
}

export function saveData<T>(key: string, data: T, options: { persist: boolean, expirationMinutes: number }): Observable<ICache<T>> {
  const cache: ICache<T> = {
    createdAt: new Date(),
    expirationDate: moment().add(options.expirationMinutes, 'minutes').toDate(),
    data
  };

  if (options.persist) {
    return storageService.set('react-cache' + key, cache);
  }

  return Observable.of(true).map(() => {
    memory[key] = cache;
    return cache;
  });
}

export function isExpirated(cache: ICache): boolean {
  if (cache.expirationDate) {
    return moment(cache.expirationDate).isBefore(moment());
  }

  const difference = Date.now() - new Date(cache.createdAt).getTime();
  return (difference / 1000 / 60) > 5; //5 minutes
}

export function clear(): Observable<void> {
  return storageService.clear(/^react-cache/gi);
}