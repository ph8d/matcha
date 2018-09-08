import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import './App.css';

// import { NotificationContainer } from 'react-notifications';
// import 'react-notifications/lib/notifications.css';

// import ProtectedRoutes from './components/ProtectedRoutes';
import HomePage from './components/HomePage';
import NavBar from './components/NavBar';
import MobileBottomNavbar from './components/MobileBottomNavbar';
import RegistrationPage from './components/RegistrationPage';
import PasswordResetPage from './components/PasswordResetPage';
import SpinLoad from './components/SpinLoad';


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
						{/* <NotificationContainer /> */}
						<Switch>
							<Route path="/" exact component={HomePage} />
							<Route path="/registration/:hash([0-9a-f]*)" component={RegistrationPage} />
							<Route path="/reset/:hash" component={PasswordResetPage} />
							<Redirect to="/" />
						</Switch>
						{/* <MobileBottomNavbar /> */}
					</div>
				</Router>
			);
		} else {
			return <SpinLoad />;
		}
	}
}

export default App;
