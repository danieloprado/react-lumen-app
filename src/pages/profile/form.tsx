import { AppBar, Card, CardContent, Divider, Grid, IconButton, TextField, Toolbar, Typography } from 'material-ui';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import * as React from 'react';

import { BaseComponent, IStateBase } from '../../components/base';
import { WithRouter } from '../../decorators/withRouter';
import { WithStyles } from '../../decorators/withStyles';
import { IProfile } from '../../interfaces/profile';
import * as profileService from '../../services/profile';
import ProfileValidator from '../../validators/profile';

export interface IState extends IStateBase<IProfile> {
}

@WithRouter()
@WithStyles({
  hr: {
    margin: '0 -16px -10px;'
  }
})
export default class ProfileFormPage extends BaseComponent<IState> {
  validator: ProfileValidator;

  constructor(props: any) {
    super(props);

    this.validator = new ProfileValidator();
    this.state = {
      model: { id: this.props.match.params.id }
    };
  }

  componentDidMount() {
    if (!this.state.model.id) return;

    profileService.get(this.state.model.id)
      .loader()
      .bindComponent(this)
      .logError()
      .subscribe(model => this.setState({ model }));
  }

  onSave() {
    if (!this.isFormValid()) {
      console.log('not valid', this.state.model, this.state.validation);
      return;
    }

    console.log('save');
  }

  render() {
    const { model } = this.state;
    const { classes } = this.props;

    return (
      <div>
        <AppBar position='static'>
          <Toolbar>
            <IconButton color='inherit' onClick={this.previousPage.bind(this)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography type='title' color='inherit'>
              {model.id ? 'Editar' : 'Cadastrar'} Perfil
            </Typography>
          </Toolbar>
        </AppBar>

        <form noValidate autoComplete='off' className='root'>
          <Card>
            <CardContent>
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
                  <Typography type='title'>Conhecimentos</Typography>
                </Grid>

                {(model.experiences || []).map((expirience, index) =>
                  <Grid item xs={12} key={index}>
                    <Divider className={classes.hr} />

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

                  </Grid>
                )}

              </Grid>
            </CardContent>
          </Card>
        </form>
      </div>
    );
  }
}