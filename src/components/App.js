import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import Catalog from './Catalog';
import Thread from './Thread';
import '../styles/app.css';

class App extends Component {
	render() {
		return (
		<div className="container">
			<Switch>
				<Route path="/threads/:id" render={routeProps => <Thread {...routeProps} key={location.pathname} />} />
				<Route path="/" render={() => <Catalog/>} />		
				// <Redirect from="/" to="/catalog" />
			</Switch>
		</div>
		)
	}
}

export default App;