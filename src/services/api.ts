import axios from 'axios';
import { Observable } from 'rxjs';

import { API_ENDPOINT, API_TIMEOUT } from '../settings';
import { ApiError } from '../errors/api';

export function get<T = any>(url: string, params?: any): Observable<T> {
  return request('GET', url, params);
}

export function post<T = any>(url: string, body: any): Observable<T> {
  return request('POST', url, body);
}

function request<T>(method: string, url: string, data: any = null): Observable<T> {
  return Observable.of(true)
    .switchMap(() => {
      return Observable.fromPromise(axios.request({
        baseURL: API_ENDPOINT,
        url,
        method,
        timeout: API_TIMEOUT,
        headers: { 'Content-type': 'application/json' },
        params: method === 'GET' ? data : null,
        data: method === 'POST' ? data : null
      }));
    })
    .map(response => response.data)
    .catch(err => {
      return err.message === 'no-internet' ?
        Observable.throw(err) :
        Observable.throw(new ApiError(err.config, err.response, err));
    });
}