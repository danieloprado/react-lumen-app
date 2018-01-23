import { Observable } from 'rxjs';
import { dateFormatter } from '../formatters/date';

export function get<T = any>(key: string): Observable<T> {
  return Observable
    .of(true)
    .map(() => localStorage.getItem(key))
    .map(data => data ? dateFormatter.parseObj(JSON.parse(data)) : null);
}

export function set<T = any>(key: string, value: T): Observable<T> {
  return Observable
    .of(true)
    .map(() => localStorage.setItem(key, JSON.stringify(value)))
    .map(() => value);
}

export function clear(regexp?: RegExp): Observable<void> {
  return Observable
    .of(true)
    .map(() => {
      if (!regexp) {
        return localStorage.clear();
      }

      Object
        .keys(localStorage)
        .filter(k => regexp.test(k))
        .forEach(key => localStorage.removeItem(key));
    });
}