import React from 'react';
import ReactDOM from 'react-dom';


import App from './app-test';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('top-line-chart'));
registerServiceWorker();
