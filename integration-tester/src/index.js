import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import numberLocalizer from 'react-widgets-simple-number';

numberLocalizer();

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
