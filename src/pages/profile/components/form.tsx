import { cloneDeep } from 'lodash';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField } from 'material-ui';
import Typography from 'material-ui/Typography/Typography';
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
    this.setState({ openned: false, model: {}, validation: null });
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
            <Grid container spacing={24}>

              <Grid item xs={12}>
                <TextField
                  label='Name'
                  fullWidth={true}
                  value={model.name || ''}
                  error={this.hasError('name')}
                  helperText={this.getErrorMessage('name')}
                  onChange={this.updateModel(v => model.name = v, this.validator)}
                  margin='normal'
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label='Email'
                  fullWidth={true}
                  value={model.email || ''}
                  error={this.hasError('email')}
                  helperText={this.getErrorMessage('email')}
                  onChange={this.updateModel(v => model.email = v, this.validator)}
                  margin='normal'
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label='Telefone'
                  fullWidth={true}
                  value={model.phone || ''}
                  error={this.hasError('phone')}
                  helperText={this.getErrorMessage('phone')}
                  onChange={this.updateModel(v => model.phone = v, this.validator)}
                  margin='normal'
                />
              </Grid>

              <Grid item xs={12}>
                <Typography type='subheading'>Conhecimentos</Typography>
              </Grid>

              {(model.experiences || []).map((expirience, index) =>
                <Grid item xs={12} key={index}>
                  <Grid container spacing={24}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label='Empresa'
                        fullWidth={true}
                        value={expirience.company || ''}
                        error={this.hasError('company')}
                        helperText={this.getErrorMessage('company')}
                        onChange={this.updateModel(v => expirience.company = v, this.validator)}
                        margin='normal'
                      />
                    </Grid>

                    <Grid item xs={6} sm={3}>
                      <TextField
                        label='Empresa'
                        fullWidth={true}
                        value={expirience.company || ''}
                        error={this.hasError('company')}
                        helperText={this.getErrorMessage('company')}
                        onChange={this.updateModel(v => expirience.company = v, this.validator)}
                        margin='normal'
                      />
                    </Grid>

                    <Grid item xs={6} sm={3}>
                      <TextField
                        label='Empresa'
                        fullWidth={true}
                        value={expirience.company || ''}
                        error={this.hasError('company')}
                        helperText={this.getErrorMessage('company')}
                        onChange={this.updateModel(v => expirience.company = v, this.validator)}
                        margin='normal'
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label='Descrição'
                        fullWidth={true}
                        multiline={true}
                        value={expirience.description || ''}
                        error={this.hasError('company')}
                        helperText={this.getErrorMessage('company')}
                        onChange={this.updateModel(v => expirience.description = v, this.validator)}
                        margin='normal'
                      />
                    </Grid>
                  </Grid>

                  <Divider />
                </Grid>
              )}

            </Grid>
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