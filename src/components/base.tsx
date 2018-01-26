import { ChangeEvent, Component, ReactInstance, ReactNode } from 'react';
import { RouteComponentProps } from 'react-router';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';

import { BaseValidator } from '../validators/base';

export interface IStateBase<T = any> {
  model?: Partial<T>;
  formSubmitted?: boolean;
  validation?: {
    [key: string]: string;
  };
}

export abstract class BaseComponent<S extends IStateBase = any, P = any, R = any> extends Component<P, S> {
  public subscriptions: Subscription[];

  public refs: R & { [key: string]: ReactInstance };
  public props: Readonly<{ children?: ReactNode }> & Readonly<P> & {
    classes?: { [key: string]: any }
  } & Partial<RouteComponentProps<any>>;

  protected validator: BaseValidator<any>;

  constructor(props: any) {
    super(props);
    this.subscriptions = [];
  }

  public componentWillUnmount(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public previousPage() {
    this.props.history.goBack();
  }

  public setState<K extends keyof S>(f: (prevState: S, props: P) => Pick<S, K>, callback?: () => any): Promise<void>;
  public setState<K extends keyof S>(state: Pick<S, K>): Promise<void>;
  public setState(state: any): Promise<void> {
    return new Promise(resolve => {
      super.setState(state as any, () => resolve());
    });
  }

  public isFormValid(validator: BaseValidator<any>): Observable<boolean> {
    return validator
      .validate(this.state.model)
      .do(({ errors }) => this.setState({ validation: errors, formSubmitted: true }))
      .map(r => r.valid);
  }

  public getErrorMessage(key: string): string {
    return (this.state.validation || {})[key];
  }

  protected updateModel(handler: (value: any) => void): any {
    return (event: ChangeEvent<any>) => {
      let { model } = this.state as any;
      handler(event.target ? event.target.value : event);

      this.setState({ model });

      if (!this.validator) {
        return;
      }

      this.validator
        .validate(model)
        .logError()
        .bindComponent(this)
        .subscribe(({ model, errors }) => {
          this.setState({ validation: errors, model });
        });
    };
  }

}