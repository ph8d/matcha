import React, { Component } from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import NavBar from './components/NavBar'
import HomeView from './components/HomeView';
import RegistrationPage from './components/RegistrationPage';
import './App.css';

class App extends Component {
	render() {
		return (
			<Router>
				<div>
					<NavBar />
					<Route path="/" exact component={HomeView} />
					<Route path="/users/register" component={RegistrationPage} />
				</div>
			</Router>
		);
	}
}

export default App;
