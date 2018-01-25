import { createMuiTheme, MuiThemeProvider, Reboot } from 'material-ui';
import { blue, red } from 'material-ui/colors';
import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import HomePage from './pages/home';

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: red
  }
});

class App extends React.Component {
  public render(): JSX.Element {
    return (
      <Router>
        <MuiThemeProvider theme={theme}>
          <Reboot />
          <Route exact path='/' component={HomePage} />
        </MuiThemeProvider>
      </Router>
    );
  }
}

export default App;
