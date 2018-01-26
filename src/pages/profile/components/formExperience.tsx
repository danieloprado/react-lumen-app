import { cloneDeep } from 'lodash';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from 'material-ui';
import * as React from 'react';
import { Observable, Subject } from 'rxjs';

import { BaseComponent, IStateBase } from '../../../components/base';
import { Field } from '../../../components/field';
import { IProfileExperience } from '../../../interfaces/profile';
import ProfileExperienceValidator from '../../../validators/profileExperience';

export interface IState extends IStateBase<IProfileExperience> {
  openned: boolean;
}

export default class ProfileFormExperienceComponent extends BaseComponent<IState> {
  result$: Subject<IProfileExperience>;
  validator: ProfileExperienceValidator;

  constructor(props: any) {
    super(props);

    this.validator = new ProfileExperienceValidator();
    this.state = { openned: false, model: {}, validation: null };
  }

  show(model?: IProfileExperience): Observable<IProfileExperience> {
    this.setState({ model: cloneDeep(model || {}), openned: true });

    this.result$ = new Subject();
    return this.result$.asObservable();
  }

  onClose() {
    this.setState({ openned: false, model: {}, validation: null });
    this.result$.complete();
  }

  onSave(event: Event) {
    event.preventDefault();

    this.isFormValid(this.validator)
      .filter(ok => ok)
      .subscribe(() => {
        this.result$.next(this.state.model as any);
        this.onClose();
      });
  }

  render() {
    const { openned, model, formSubmitted } = this.state;

    return (
      <Dialog
        open={openned}
        onClose={this.onClose.bind(this)}
        fullWidth={true}
        disableBackdropClick={true}
        disableEscapeKeyDown={true}>

        <DialogTitle>{model.id ? 'Editar' : 'Criar'}</DialogTitle>
        <DialogContent>
          <form noValidate autoComplete='off' onSubmit={this.onSave.bind(this)}>
            <Grid container spacing={24}>
              <Grid item xs={12} sm={6}>
                <Field
                  label='Empresa'
                  value={model.company}
                  submitted={formSubmitted}
                  error={this.getErrorMessage('company')}
                  onChange={this.updateModel(v => model.company = v)}
                />
              </Grid>

              <Grid item xs={6} sm={3}>
                <Field
                  label='Inicio'
                  type='date'
                  value={model.started_at}
                  submitted={formSubmitted}
                  error={this.getErrorMessage('started_at')}
                  onChange={this.updateModel(v => model.started_at = v)}
                />
              </Grid>

              <Grid item xs={6} sm={3}>
                <Field
                  label='Término'
                  type='date'
                  value={model.ended_at}
                  submitted={formSubmitted}
                  error={this.getErrorMessage('ended_at')}
                  onChange={this.updateModel(v => model.ended_at = v)}
                  margin='normal'
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  label='Descrição'
                  multiline={true}
                  value={model.description}
                  submitted={formSubmitted}
                  error={this.getErrorMessage('description')}
                  onChange={this.updateModel(v => model.description = v)}
                />
              </Grid>
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