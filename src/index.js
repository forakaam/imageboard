import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import App from './components/App'
import history from './history';
ReactDOM.render(
	<BrowserRouter history={history}>
		<App/>
	</BrowserRouter>,
	document.getElementById('root')
);