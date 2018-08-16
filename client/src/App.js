import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import NavBar from './components/NavBar';
import { Provider } from 'mobx-react';
import stores from './stores';
import './App.css';


class App extends React.Component {
	render() {
		return (
			<Provider user={stores.user}>
				<Router>
					<div>
						<NavBar />
						<Switch>
							<Route path="/" exact component={HomePage} />
						</Switch>
					</div>
				</Router>
			</Provider>
		);
	}
}

export default App;
