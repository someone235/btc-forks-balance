import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import * as btc from './currencies/btc'

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

btc.getBalance('3D2oetdNuZUqQHPJmcMDDHYoqkyNVsFk9r').then(data => console.log(data))