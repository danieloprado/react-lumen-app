import { LinearProgress, Paper } from 'material-ui';
import { AppBar, Toolbar, Typography } from 'material-ui';
import * as React from 'react';

import { BaseComponent, IStateBase } from '../../components/base';
import { ApplyStyles } from '../../decorators/applyStyles';
import { IProfile } from '../../interfaces/profile';
import { profileService } from '../../services';
import TableProfile from './components/table';

interface IState extends IStateBase {
  profiles: IProfile[];
  loading: boolean;
}

@ApplyStyles({
  root: {
    padding: '1rem'
  }
})
export default class Home extends BaseComponent<IState> {

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
    const { classes } = this.props;

    return (
      <div>
        <AppBar position='static'>
          <Toolbar>
            <Typography type='title' color='inherit'>
              React Lumen App
            </Typography>
          </Toolbar>
        </AppBar>

        <div className={classes.root}>
          {loading &&
            <LinearProgress color='secondary' />
          }

          <Paper>
            <TableProfile profiles={profiles} />
          </Paper>
        </div>
      </div>
    );
  }

}