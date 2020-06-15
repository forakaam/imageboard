import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import Catalog from './Catalog';
import Thread from './Thread';
import '../styles/app.css'

class App extends Component {
	render() {
		return (
		<div class="container">
			<Switch class="container">
				<Route path="/threads/:id" render={routeProps => <Thread {...routeProps}/>} />
				<Route path="/" render={() => <Catalog/>} />		
				// <Redirect from="/" to="/catalog" />
			</Switch>
		</div>
		)
	}
}

export default App;