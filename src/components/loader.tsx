import CircularProgress from 'material-ui/Progress/CircularProgress';
import * as React from 'react';

import { WithStyles } from '../decorators/withStyles';
import * as loader from '../operators/loader';
import { BaseComponent, IStateBase } from './base';

interface IState extends IStateBase {
  refs: string[];
}

@WithStyles({
  root: {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: 'rgba(0,0,0,.5)',
    zIndex: 999,
    textAlign: 'center',
    lineHeight: '100vh'
  },
  hidden: {
    display: 'none'
  }
})
export default class LoaderComponent extends BaseComponent<IState> {
  constructor(props: any) {
    super(props);

    loader.setup(this);
    this.state = { refs: [] };
  }

  public show(ref: string): void {
    if (typeof ref !== 'string') {
      throw new Error('Loader.show needs a ref string value');
    }

    const { refs } = this.state;
    if (refs.some(r => r === ref)) return;

    refs.push(ref);
    this.setState({ refs });
  }

  public hide(ref: string): void {
    if (typeof ref !== 'string') {
      throw new Error('Loader.hide needs a ref string value');
    }

    const { refs } = this.state;
    const index = refs.indexOf(ref);
    if (index === -1) return;

    refs.splice(index, 1);
    this.setState({ refs });
  }

  render() {
    const { refs } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.root + ' ' + (!refs.length ? classes.hidden : '')}>
        <CircularProgress size={80} />
      </div>
    );
  }

}