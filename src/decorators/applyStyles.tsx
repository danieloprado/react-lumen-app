import { withStyles } from 'material-ui';
import { StyleRules, StyleRulesCallback } from 'material-ui/styles';
import { WithStylesOptions } from 'material-ui/styles/withStyles';

export function ApplyStyles(
  styles: StyleRules<any> | StyleRulesCallback<any>,
  options?: WithStylesOptions
) {
  return function <T>(target: T): T {
    return withStyles(styles)(target as any) as any;
  };
}