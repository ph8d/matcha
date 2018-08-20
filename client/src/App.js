import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import './App.css';

import ProtectedRoutes from './components/ProtectedRoutes';
import HomePage from './components/HomePage';
import NavBar from './components/NavBar';
import Notification from './components/Notification';

@inject('UserStore', 'CommonStore') @observer
class App extends React.Component {

	componentWillMount() {
		if (!this.props.CommonStore.token) {
			this.props.CommonStore.setAppLoaded(true);
		}
	}

	componentDidMount() {
		if (this.props.CommonStore.token) {
			this.props.UserStore.pullUser()
				.then(user => {
					this.props.CommonStore.setAppLoaded(true);
				})
		}
	}

	render() {
		if (this.props.CommonStore.appLoaded) {
			return (
				<Router>
					<div>
						<NavBar />
						<Switch>
							<Route path="/" exact component={HomePage} />
							<ProtectedRoutes>
								<Route path="/about" exact component={Notification} />
							</ProtectedRoutes>
						</Switch>
					</div>
				</Router>
			);
		} else {
			return ''; // Loading...
		}
	}
}

export default App;
