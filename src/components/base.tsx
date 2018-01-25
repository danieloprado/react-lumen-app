import { ChangeEvent, Component, ReactInstance, ReactNode } from 'react';
import { Subscription } from 'rxjs';

import { BaseValidator } from '../validators/base';

export interface IStateBase<T = any> {
  model?: Partial<T>;
  validation?: {
    [key: string]: string;
  };
}

export abstract class BaseComponent<S extends IStateBase = any, P = any, R = any> extends Component<P, S> {
  public subscriptions: Subscription[];

  public refs: R & { [key: string]: ReactInstance };
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

  public isFormValid(): boolean {
    return !Object.keys(this.state.validation || {}).length;
  }

  public hasError(key: string): boolean {
    return !!this.getErrorMessage(key);
  }

  public getErrorMessage(key: string): string {
    return (this.state.validation || {})[key];
  }

  protected updateModel(handler: (value: any) => void, validator?: BaseValidator<any>): any {
    return (event: ChangeEvent<any>) => {
      let { model } = this.state as any;
      handler(event.target.value);

      this.setState({ model });

      if (!validator) {
        this.setState({ validation: {}, model });
        return;
      }

      (validator as BaseValidator<any>).validate(model)
        .logError()
        .bindComponent(this)
        .subscribe(({ model, errors }) => {
          this.setState({ validation: errors, model });
        });
    };
  }

}