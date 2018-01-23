import { isDevelopment } from '../settings';

export function breadcrumb(text: string, type: string = 'manual', extraData: any = {}): void {
  if (isDevelopment) console.log('breadcrumb: ' + type + ' - ' + text, extraData);

  extraData = extraData || {};
  delete extraData.type;

  //TODO: Breadcrumb
}

export function handleError(err: any, force: boolean = false): void {
  if (!err) return;

  if (typeof err === 'string') {
    err = new Error(err);
  }

  if (err.ignoreLog && !force) {
    return;
  }

  if (isDevelopment) {
    console.error(err);
    console.log(err.metadata);
    return;
  }

  //TODO: notifiy
}