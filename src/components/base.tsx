import { Component } from 'react';
import { Subscription } from 'rxjs';

export interface IStateBase<T = any> {
  model?: Partial<T>;
  validation?: {
    [key: string]: string;
  };
}

export abstract class BaseComponent<S extends IStateBase = IStateBase, P = any> extends Component<P, S> {
  public subscriptions: Subscription[];

  constructor(props: any) {
    super(props);
    this.subscriptions = [];
  }

  public componentWillUnmount(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}