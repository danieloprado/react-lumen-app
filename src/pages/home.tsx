import { LinearProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow } from 'material-ui';
import { AppBar, Toolbar, Typography, withStyles } from 'material-ui';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import { TableFooter, TablePagination } from 'material-ui/Table';
import * as React from 'react';

import { BaseComponent } from '../components/base';
import DropdownMenu from '../components/dropdownMenu';
import { IProfile } from '../interfaces/profile';
import { profileService } from '../services';

interface IState {
  allProfiles: Array<IProfile & { menuEl?: any }>;
  paginatedProfiles: Array<IProfile & { menuEl?: any }>;
  loading: boolean;
  pageSize: number;
  currentPage: number;
}

class Home extends BaseComponent<IState> {

  constructor(props: any) {
    super(props);

    this.state = {
      allProfiles: [],
      paginatedProfiles: [],
      loading: true,
      pageSize: 10,
      currentPage: 0
    };
  }

  componentDidMount() {
    profileService
      .list()
      .delay(500)
      .bindComponent(this)
      .logError()
      .subscribe(allProfiles => {
        this.setState({ allProfiles, loading: false });
        this.onChangePagination();
      });
  }

  async onChangePage(event: any, currentPage: number) {
    await this.setState({ currentPage });
    this.onChangePagination();
  }

  async onPageSizeChange(event: any) {
    await this.setState({ pageSize: event.target.value });
    this.onChangePagination();
  }

  onChangePagination() {
    const { allProfiles, pageSize, currentPage } = this.state;
    const paginatedProfiles = allProfiles
      .slice(currentPage * pageSize, currentPage * pageSize + pageSize);

    this.setState({ paginatedProfiles });
  }

  render() {
    const { allProfiles, paginatedProfiles, loading, pageSize, currentPage } = this.state;
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
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProfiles.map(profile => {
                  return (
                    <TableRow key={profile.id}>
                      <TableCell>{profile.name}</TableCell>
                      <TableCell>{profile.email}</TableCell>
                      <TableCell className={classes.tableButtons}>
                        <DropdownMenu options={[{
                          icon: <EditIcon />,
                          text: 'Editar',
                          handler: () => console.log('clicked')
                        }, {
                          icon: <DeleteIcon />,
                          text: 'Excluir',
                          handler: () => console.log('clicked')
                        }]} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    colSpan={3}
                    count={allProfiles.length}
                    rowsPerPage={pageSize}
                    page={currentPage}
                    onChangePage={this.onChangePage.bind(this)}
                    onChangeRowsPerPage={this.onPageSizeChange.bind(this)}
                  />
                </TableRow>
              </TableFooter>
            </Table>

          </Paper>
        </div>
      </div>
    );
  }

}

export default withStyles({
  root: {
    padding: '1rem'
  },
  tableButtons: {
    textAlign: 'center',
    paddingRight: '0 !important'
  }
})(Home);