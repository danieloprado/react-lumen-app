import { AppBar, Card, IconButton, LinearProgress, Toolbar, Typography } from 'material-ui';
import AddIcon from 'material-ui-icons/PersonAdd';
import * as React from 'react';

import { BaseComponent, IStateBase } from '../../components/base';
import { WithRouter } from '../../decorators/withRouter';
import { WithStyles } from '../../decorators/withStyles';
import { IProfile } from '../../interfaces/profile';
import { profileService } from '../../services';
import { showConfirm } from '../../services/dialog';
import TableProfile from './components/table';

interface IState extends IStateBase {
  profiles: IProfile[];
  loading: boolean;
}

@WithRouter()
@WithStyles({
  flex: {
    flex: 1
  }
})
export default class ProfileListPage extends BaseComponent<IState> {

  constructor(props: any) {
    super(props);

    this.state = {
      profiles: [],
      loading: true,
    };
  }

  componentDidMount() {
    profileService
      .list()
      .delay(500)
      .bindComponent(this)
      .logError()
      .subscribe(profiles => {
        this.setState({ profiles, loading: false });
      });
  }

  onCreate() {
    this.props.history.push('/profile');
  }

  onEdit(profile: IProfile) {
    this.props.history.push(`/profile/${profile.id}`);
  }

  onDelete(profile: IProfile, index: number) {
    showConfirm(`Deseja realmente apagar o curriculo  do ${profile.name}?`)
      .filter(ok => ok)
      .switchMap(() => profileService.remove(profile.id).logError())
      .bindComponent(this)
      .logError()
      .subscribe(() => {
        const { profiles } = this.state;

        profiles.splice(index, 1);
        this.setState({ profiles });
      });
  }

  render() {
    const { profiles, loading } = this.state;
    const { classes } = this.props;

    return (
      <div>
        <AppBar position='static'>
          <Toolbar>
            <Typography type='title' color='inherit' className={classes.flex}>
              Listagem
            </Typography>
            <IconButton color='inherit' onClick={this.onCreate.bind(this)}>
              <AddIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <div className='root'>
          {loading &&
            <LinearProgress color='secondary' />
          }

          <Card>
            <TableProfile
              profiles={profiles}
              onEdit={this.onEdit.bind(this)}
              onDelete={this.onDelete.bind(this)}
            />
          </Card>
        </div>
      </div>
    );
  }

}