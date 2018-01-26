import { AppBar, Button, Card, CardContent, Grid, IconButton, Table, Toolbar, Typography } from 'material-ui';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import * as React from 'react';

import { BaseComponent, IStateBase } from '../../components/base';
import DropdownMenu from '../../components/dropdownMenu';
import { Field } from '../../components/field';
import { WithRouter } from '../../decorators/withRouter';
import { WithStyles } from '../../decorators/withStyles';
import { dateFormatter } from '../../formatters/date';
import { IProfile, IProfileExperience } from '../../interfaces/profile';
import * as profileService from '../../services/profile';
import ProfileValidator from '../../validators/profile';
import ProfileFormExperience from './components/formExperience';

interface IState extends IStateBase<IProfile> {
}

interface IRefs {
  formExpirience: ProfileFormExperience;
}

@WithRouter()
@WithStyles({
  card: {
    marginBottom: '20px'
  }
})
export default class ProfileFormPage extends BaseComponent<IState, {}, IRefs> {
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

  formExperience(expirience?: IProfileExperience) {
    this.refs.formExpirience
      .show(expirience)
      .bindComponent(this)
      .logError()
      .subscribe(result => {
        const { model } = this.state;
        if (expirience) {
          Object.assign(expirience, result);
          this.setState({ model });
          return;
        }

        model.experiences.push(result);
        this.setState({ model });
      });
  }

  removeExpirience(index: number) {
    const { model } = this.state;
    model.experiences.splice(index, 1);

    this.setState({ model });
  }

  onSave(event: Event) {
    event.preventDefault();

    this.isFormValid(this.validator)
      .filter(ok => ok)
      .switchMap(() => profileService.save(this.state.model as any).loader())
      .bindComponent(this)
      .logError()
      .subscribe(() => {
        this.props.history.push('/');
      });
  }

  render() {
    const { model, formSubmitted } = this.state;
    const { classes } = this.props;

    return (
      <div>
        <ProfileFormExperience ref='formExpirience' />

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

        <form noValidate autoComplete='off' className='root' onSubmit={this.onSave.bind(this)}>
          <Card className={classes.card}>
            <CardContent>
              <Grid container spacing={24}>

                <Grid item xs={12}>
                  <Field
                    label='Name'
                    submitted={formSubmitted}
                    value={model.name}
                    error={this.getErrorMessage('name')}
                    onChange={this.updateModel(v => model.name = v)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Field
                    label='Email'
                    submitted={formSubmitted}
                    value={model.email}
                    error={this.getErrorMessage('email')}
                    onChange={this.updateModel(v => model.email = v)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Field
                    label='Telefone'
                    submitted={formSubmitted}
                    value={model.phone}
                    mask='phone'
                    error={this.getErrorMessage('phone')}
                    onChange={this.updateModel(v => model.phone = v)}
                  />
                </Grid>

              </Grid>
            </CardContent>
          </Card>

          <Card className={classes.card}>
            <CardContent>
              <Grid container spacing={24}>

                <Grid item xs={true}>
                  <Typography type='title'>Experiência</Typography>
                </Grid>

                <Grid item>
                  <Button color='secondary' onClick={this.formExperience.bind(this, null)}>Adicionar</Button>
                </Grid>

                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Empresa</TableCell>
                      <TableCell>Inicio/Término</TableCell>
                      <TableCell>Descrição</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(model.experiences || []).map((expirience, index) =>
                      <TableRow key={index}>
                        <TableCell>{expirience.company}</TableCell>
                        <TableCell>
                          {dateFormatter.format(expirience.started_at)}
                          <br />
                          {expirience.ended_at && dateFormatter.format(expirience.ended_at)}
                        </TableCell>
                        <TableCell>{expirience.description}</TableCell>
                        <TableCell numeric>
                          <DropdownMenu options={[{
                            icon: <EditIcon />,
                            text: 'Editar',
                            handler: () => this.formExperience(expirience)
                          }, {
                            icon: <DeleteIcon />,
                            text: 'Excluir',
                            handler: () => this.removeExpirience(index)
                          }]} />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

              </Grid>
            </CardContent>
          </Card>

          <Grid container spacing={24} justify='flex-end'>
            <Grid item>
              <Button type='submit' raised color='secondary'>Salvar</Button>
            </Grid>
          </Grid>
        </form>
      </div >
    );
  }
}