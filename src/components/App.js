import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import Catalog from './Catalog';
import Thread from './Thread';
import '../styles/app.css'

class App extends Component {
	render() {
		return (
		<Switch>
			<Route path="/" render={() => <Catalog/>} />
			<Route path="/thread/:id" render={() => <Thread/>} />
			// <Redirect from="/" to="/catalog" />
		</Switch>
		)
	}
}

export default App;