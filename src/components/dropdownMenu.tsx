import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from 'material-ui';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import * as React from 'react';

import { ApplyStyles } from '../decorators/applyStyles';
import { BaseComponent, IStateBase } from './base';

interface IState extends IStateBase {
  targetElem?: HTMLElement;
}

interface IProps {
  options: {
    text: string;
    icon?: any;
    handler: () => void
  }[];
}

@ApplyStyles({
  text: {
    paddingLeft: '0 !important'
  }
})
export default class DropdownMenu extends BaseComponent<IState, IProps> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  open(event: any) {
    this.setState({ targetElem: event.currentTarget });
  }

  close(handler: Function) {
    this.setState({ targetElem: null });

    if (typeof handler !== 'function') return;
    handler();
  }

  render() {
    const { targetElem } = this.state;
    const { options, classes } = this.props;

    return (
      <div>
        <IconButton onClick={this.open.bind(this)}>
          <MoreVertIcon />
        </IconButton>

        <Menu
          anchorEl={targetElem}
          open={!!targetElem}
          onClose={this.close.bind(this)}>
          {options.map((option, i) =>
            <MenuItem
              key={i}
              onClick={this.close.bind(this, option.handler)}>
              {!!option.icon &&
                <ListItemIcon>
                  {option.icon}
                </ListItemIcon>
              }
              <ListItemText className={option.icon ? classes.text : null} inset primary={option.text} />
            </MenuItem>
          )}
        </Menu>
      </div>
    );
  }
}