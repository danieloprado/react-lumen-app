import { Component, ReactNode } from 'react';
import { Subscription } from 'rxjs';

export abstract class BaseComponent<S = any, P = any> extends Component<P, S> {
  public subscriptions: Subscription[];

  public state: Readonly<S>;
  public props: Readonly<{ children?: ReactNode }> & Readonly<P> & {
    classes?: { [key: string]: any }
  };

  constructor(props: any) {
    super(props);
    this.subscriptions = [];
  }

  public componentWillUnmount(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public setState<K extends keyof S>(f: (prevState: S, props: P) => Pick<S, K>, callback?: () => any): Promise<void>;
  public setState<K extends keyof S>(state: Pick<S, K>): Promise<void>;
  public setState(state: any): Promise<void> {

    return new Promise(resolve => {
      super.setState(state as any, () => resolve());
    });
  }

}