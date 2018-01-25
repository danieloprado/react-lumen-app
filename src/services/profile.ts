import { Observable } from 'rxjs';

import { apiService } from '.';
import { dateFormatter } from '../formatters/date';
import { IProfile } from '../interfaces/profile';

export function list(): Observable<IProfile[]> {
  return apiService
    .get<IProfile[]>('/profile')
    .map(profiles => dateFormatter.parseObj(profiles));
}