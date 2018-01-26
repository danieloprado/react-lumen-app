import { Observable } from 'rxjs';

import { apiService } from '.';
import { dateFormatter } from '../formatters/date';
import { IProfile } from '../interfaces/profile';

export function list(): Observable<IProfile[]> {
  return apiService
    .get<IProfile[]>('/profile')
    .map(profiles => dateFormatter.parseObj(profiles));
}

export function get(id: number): Observable<IProfile> {
  return apiService
    .get<IProfile>(`/profile/${id}`)
    .map(profile => dateFormatter.parseObj(profile));
}

export function save(model: IProfile): Observable<IProfile> {
  return apiService
    .post<IProfile>('/profile', model)
    .map(profile => dateFormatter.parseObj(profile));
}

export function remove(id: number): Observable<void> {
  return apiService.del(`/profile/${id}`);
}