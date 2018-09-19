import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import './App.css';

// import { NotificationContainer } from 'react-notifications';
// import 'react-notifications/lib/notifications.css';

import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import RegistrationPage from './components/RegistrationPage';
import ProtectedRoutes from './components/ProtectedRoutes';
import ProfilePage from './components/ProfilePage';
import ConversationsPage from './components/ConversationsPage';
import notificationPage from './components/NotificationPage';
import PasswordResetPage from './components/PasswordResetPage';
import SpinLoad from './components/SpinLoad';


@inject('CommonStore', 'UserStore', 'ConversationStore', 'SocketStore') @observer
class App extends React.Component {

	addNotification

	async componentDidMount() {
		const { CommonStore, UserStore, ConversationStore, SocketStore } = this.props;

		if (CommonStore.token) {
			await UserStore.pullUser();
			CommonStore.setAppLoaded(true);
		} else {
			CommonStore.setAppLoaded(true);
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
							<Route path="/registration/:hash([0-9a-f]*)" component={RegistrationPage} />
							<Route path="/reset/:hash([0-9a-f]*)" component={PasswordResetPage} />
							<ProtectedRoutes>
								<Switch>
									<Route path="/profile/:login([A-Za-z0-9_]{4,24})" component={ProfilePage} />
									<Route path="/chats" component={ConversationsPage} />
									<Route path="/notifications" component={notificationPage} />
								</Switch>
							</ProtectedRoutes>
							<Redirect to="/" />
						</Switch>
					</div>
				</Router>
			);
		} else {
			return <SpinLoad />;
		}
	}
}

export default App;
