import { AppBar, Card, LinearProgress, Toolbar, Typography } from 'material-ui';
import * as React from 'react';

import { BaseComponent, IStateBase } from '../../components/base';
import { IProfile } from '../../interfaces/profile';
import { profileService } from '../../services';
import TableProfile from './components/table';

interface IState extends IStateBase {
  profiles: IProfile[];
  loading: boolean;
}

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

  render() {
    const { profiles, loading } = this.state;

    return (
      <div>
        <AppBar position='static'>
          <Toolbar>
            <Typography type='title' color='inherit'>
              Listagem
            </Typography>
          </Toolbar>
        </AppBar>

        <div className='root'>
          {loading &&
            <LinearProgress color='secondary' />
          }

          <Card>
            <TableProfile profiles={profiles} />
          </Card>
        </div>
      </div>
    );
  }

}