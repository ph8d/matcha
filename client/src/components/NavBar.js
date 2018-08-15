import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css'

class NavBar extends Component {
	render() {
		return (
			<nav className="navbar has-shadow" aria-label="main navigation">
				<div className="container">
					<div className="navbar-brand">
						<Link className="navbar-item" to='/'>
							<strong>MATCHA</strong>
						</Link>
						<a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false">
							<span aria-hidden="true"></span>
							<span aria-hidden="true"></span>
							<span aria-hidden="true"></span>
						</a>
					</div>

					<div className="navbar-menu">
						<div className="navbar-start">
							<Link className="navbar-item" to="/">Home</Link>
							<Link className="navbar-item" to="/about">About</Link>
						</div>

						<div className="navbar-end">
							<Link className="navbar-item" to="/users/login">Login</Link>
							<Link className="navbar-item" to="/users/register">Register</Link>
						</div>
					</div>
				</div>
			</nav>
		);
	}
}

export default NavBar;
