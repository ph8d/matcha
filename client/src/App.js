import React, { Component } from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import NavBar from './components/NavBar'
import RegistrationPage from './components/RegistrationPage';

class App extends Component {
	render() {
		return (
			<Router>
				<div>
					<NavBar />
					<Route path="/users/register" component={RegistrationPage} />
				</div>
			</Router>
		);
	}
}

export default App;
