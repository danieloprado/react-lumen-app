import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui';
import * as React from 'react';
import { Observable, Subject } from 'rxjs';

import { IAlertComponent, setup } from '../services/dialog';
import { BaseComponent, IStateBase } from './base';

interface IState extends IStateBase {
  openned: boolean;
  message?: string;
  title?: string;
  confirmation?: boolean;
}

export default class AlertComponent extends BaseComponent<IState> implements IAlertComponent {
  result$: Subject<boolean>;

  constructor(props: any) {
    super(props);
    this.state = { openned: false, title: 'Alerta' };
  }

  componentDidMount() {
    setup(this);
  }

  show(message: string, title: string, confirmation: boolean = false): Observable<boolean> {
    this.setState({ openned: true, message, title, confirmation });

    this.result$ = new Subject();
    return this.result$.asObservable();
  }

  onClose(ok: boolean) {
    this.setState({ openned: false });

    this.result$.next(ok);
    this.result$.complete();
  }

  render() {
    const { openned, title, message, confirmation } = this.state;

    return (
      <Dialog
        open={openned}
        keepMounted
        onClose={this.onClose.bind(this, false)}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {confirmation &&
            <Button onClick={this.onClose.bind(this, false)} color='primary'>
              Cancelar
            </Button>
          }
          <Button onClick={this.onClose.bind(this, true)} color='primary'>
            OK
            </Button>
        </DialogActions>
      </Dialog>
    );
  }
}