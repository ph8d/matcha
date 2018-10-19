import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import RegistrationPage from './components/RegistrationPage';
import ProfilePage from './components/ProfilePage';
import SettingsPage from './components/SettingsPage'
import ProfileEditPage from './components/ProfileEditPage';
import ConversationsPage from './components/ConversationsPage';
import notificationPage from './components/NotificationPage';
import PasswordResetPage from './components/PasswordResetPage';
import DiscoverPage from './components/DiscoverPage';
import SpinLoad from './components/SpinLoad';

import 'izitoast/dist/css/iziToast.min.css';

@inject('CommonStore', 'UserStore', 'ConversationStore') @observer
class App extends React.Component {
	async componentDidMount() {
		const { CommonStore, UserStore, ConversationStore } = this.props;

		if (CommonStore.token) {
			await UserStore.pullUser();
			await ConversationStore.pullConversations();
			CommonStore.setAppLoaded(true);
		} else {
			CommonStore.setAppLoaded(true);
		}
	}

	render() {
		if (this.props.CommonStore.appLoaded) {
			return (
				<Router>
					<React.Fragment>
						<NavBar />
						<Switch>
							<Route path="/" exact component={HomePage} />
							<Route path="/registration/:hash([0-9a-f]*)" component={RegistrationPage} />
							<Route path="/reset/:hash([0-9a-f]*)" component={PasswordResetPage} />

							<ProtectedRoute path="/edit-profile" component={ProfileEditPage}/>
							<ProtectedRoute path="/settings" component={SettingsPage} />
							<ProtectedRoute path="/chats" component={ConversationsPage} />
							<ProtectedRoute path="/notifications" component={notificationPage} />
							<ProtectedRoute path="/profile/:login([A-Za-z0-9_]{4,24})" component={ProfilePage} />
							<ProtectedRoute path="/discover" component={DiscoverPage} />

							<Redirect to="/" />
						</Switch>
					</React.Fragment>
				</Router>
			);
		} else {
			return <SpinLoad />;
		}
	}
}

@inject('UserStore') @observer
class ProtectedRoute extends React.Component {
	render() {
		const { UserStore, component : Component, ...rest } = this.props;
		return (
			<Route {...rest} render={(props) => (
				UserStore.currentUser
					? <Component {...props} />
					: <Redirect to='/login' />
			)} />
		);
	}
}

export default App;
