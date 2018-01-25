import './global.css';
import 'moment/locale/pt-br';

import moment from 'moment';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

moment.locale('pt-BR');

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
