import { Observable } from 'rxjs/Observable';

let alertComponent: IAlertComponent;

export interface IAlertComponent {
  show(message: string, title: string, confirmation?: boolean): Observable<boolean>;
}

export function setup(compoent: IAlertComponent): void {
  alertComponent = compoent;
}

export function showAlert(message: string, title: string = 'Alerta'): Observable<boolean> {
  return Observable
    .of(true)
    .switchMap(() => alertComponent.show(message, title, false));
}

export function showConfirm(message: string, title: string = 'Confirmação'): Observable<boolean> {
  return Observable
    .of(true)
    .switchMap(() => alertComponent.show(message, title, true));
}