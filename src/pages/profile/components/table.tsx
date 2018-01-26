import { Table } from 'material-ui';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import { TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow } from 'material-ui/Table';
import * as React from 'react';

import { BaseComponent, IStateBase } from '../../../components/base';
import DropdownMenu from '../../../components/dropdownMenu';
import { WithRouter } from '../../../decorators/withRouter';
import { WithStyles } from '../../../decorators/withStyles';
import { IProfile } from '../../../interfaces/profile';

interface IState extends IStateBase {
  paginatedProfiles: Array<IProfile & { menuEl?: any }>;
  pageSize: number;
  currentPage: number;
}

interface IProps {
  profiles: IProfile[];
  onEdit: Function;
  onDelete: Function;
}

@WithRouter()
@WithStyles({
  textButton: {
    paddingRight: '0 !important',
    textAlign: 'right'
  }
})
export default class ProfileTableComponent extends BaseComponent<IState, IProps> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      paginatedProfiles: [],
      pageSize: 10,
      currentPage: 0
    };
  }

  componentWillReceiveProps(nextProps: IProps) {
    this.onChangePagination(nextProps.profiles);
  }

  async onChangePage(event: any, currentPage: number) {
    await this.setState({ currentPage });
    this.onChangePagination();
  }

  async onPageSizeChange(event: any) {
    await this.setState({ pageSize: event.target.value });
    this.onChangePagination();
  }

  onChangePagination(profiles?: IProfile[]) {
    const { pageSize, currentPage } = this.state;
    const paginatedProfiles = profiles || this.props.profiles
      .slice(currentPage * pageSize, currentPage * pageSize + pageSize);

    this.setState({ paginatedProfiles });
  }

  render() {
    const { paginatedProfiles, pageSize, currentPage } = this.state;
    const { profiles, classes, onEdit, onDelete } = this.props;

    return (
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProfiles.map((profile, index) => {
              return (
                <TableRow key={profile.id}>
                  <TableCell>{profile.name}</TableCell>
                  <TableCell>{profile.email}</TableCell>
                  <TableCell className={classes.textButton}>
                    <DropdownMenu options={[{
                      icon: <EditIcon />,
                      text: 'Editar',
                      handler: () => onEdit(profile)
                    }, {
                      icon: <DeleteIcon />,
                      text: 'Excluir',
                      handler: () => onDelete(profile, index)
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
                count={profiles.length}
                rowsPerPage={pageSize}
                page={currentPage}
                onChangePage={this.onChangePage.bind(this)}
                onChangeRowsPerPage={this.onPageSizeChange.bind(this)}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    );
  }
}