import './operators/bindComponent';
import './operators/cache';
import './operators/logError';

import { createMuiTheme, MuiThemeProvider, Reboot } from 'material-ui';
import { blue, red } from 'material-ui/colors';
import * as React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import AlertComponent from './components/alert';
import LoaderComponent from './components/loader';
import ProfileFormPage from './pages/profile/form';
import ProfileListPage from './pages/profile/list';

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: red
  }
});

interface IState {
  loaded: boolean;
}

class App extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = { loaded: false };
  }

  componentDidMount() {
    this.setState({ loaded: true });
  }

  render() {
    const { loaded } = this.state;

    return (
      <MuiThemeProvider theme={theme}>
        <Reboot />
        <LoaderComponent />
        <AlertComponent />

        {loaded &&
          <Router>
            <Switch>
              <Route exact path='/' component={ProfileListPage} />
              <Route path='/profile/:id?' component={ProfileFormPage} />
              <Route render={() => <Redirect to='/' />} />
            </Switch>
          </Router>
        }
      </MuiThemeProvider>
    );
  }
}

export default App;
