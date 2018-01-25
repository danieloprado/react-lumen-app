import { cloneDeep } from 'lodash';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from 'material-ui';
import * as React from 'react';

import { BaseComponent, IStateBase } from '../../../components/base';
import { IProfile } from '../../../interfaces/profile';
import ProfileValidator from '../../../validators/profile';

export interface IState extends IStateBase<IProfile> {
  openned: boolean;
}

export default class HomeFormComponent extends BaseComponent<IState> {
  validator: ProfileValidator;

  constructor(props: any) {
    super(props);

    this.validator = new ProfileValidator();
    this.state = { openned: false, model: {} };
  }

  show(profile?: IProfile) {
    this.setState({ model: cloneDeep(profile || {}), openned: true });
  }

  onClose() {
    this.setState({ openned: false, model: {} });
  }

  onSave() {
    if (!this.isFormValid()) {
      console.log('not valid', this.state.model, this.state.validation);
      return;
    }

    console.log('save');
  }

  render() {
    const { openned, model } = this.state;

    return (
      <Dialog
        open={openned}
        onClose={this.onClose.bind(this)}
        fullWidth={true}
        disableBackdropClick={true}
        disableEscapeKeyDown={true}>

        <DialogTitle>{model.id ? 'Editar' : 'Criar'}</DialogTitle>
        <DialogContent>
          <form noValidate autoComplete='off'>
            <TextField
              label='Name'
              fullWidth={true}
              value={model.name}
              error={this.hasError('name')}
              helperText={this.getErrorMessage('name')}
              onChange={this.updateModel(v => model.name = v, this.validator)}
              margin='normal'
            />

            <TextField
              label='Email'
              fullWidth={true}
              value={model.email}
              error={this.hasError('email')}
              helperText={this.getErrorMessage('email')}
              onChange={this.updateModel(v => model.email = v, this.validator)}
              margin='normal'
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onClose.bind(this)}>
            Cancelar
          </Button>
          <Button onClick={this.onSave.bind(this)} color='secondary' raised>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}