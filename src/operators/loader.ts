import * as lodash from 'lodash';
import { Observable, Subscriber, Subscription } from 'rxjs';

let globalLoaderComponent: any;

export function setup(loader: { show: Function, hide: Function }): void {
  globalLoaderComponent = loader;
}

function loader<T>(this: Observable<T>, loaderComponent: any = globalLoaderComponent): Observable<T> {
  return this.lift(new LoaderOperator(loaderComponent));
}

Observable.prototype.loader = loader;

declare module 'rxjs/Observable' {
  // tslint:disable-next-line:interface-name
  interface Observable<T> { loader: typeof loader; }
}

class LoaderOperator {
  constructor(private loaderComponent: any) {
  }

  public call(subscriber: Subscriber<any>, source: Observable<any>): Subscription {
    return source
      .delay(500)
      .subscribe(new LoaderSubscriber(subscriber, this.loaderComponent));
  }
}

class LoaderSubscriber extends Subscriber<any> {
  private ref: string;

  constructor(
    protected destination: Subscriber<any>,
    private loader: { show: Function, hide: Function }
  ) {
    super(destination);

    this.ref = lodash.uniqueId();
    this.show();
  }

  public _next(value: any): void {
    this.hide();
    this.destination.next(value);
  }

  public _complete(): void {
    this.hide();
    this.destination.complete();
  }

  public _error(err: any): void {
    this.hide();
    this.destination.error(err);
  }

  public _unsubscribe(): void {
    this.hide();
    this.destination.unsubscribe();
  }

  private show(): void {
    this.loader.show(this.ref);
  }

  private hide(): void {
    this.loader.hide(this.ref);
  }
}