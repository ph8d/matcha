import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavBar extends Component {
	render() {
		return (
			<nav className="navbar navbar-expand-lg navbar-light shadow-sm">
				<div className="container">
					<a className="navbar-brand" href="/">Matcha</a>
					<button className="navbar-toggler" type="button" data-toggle="collapse" data-target=".navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse navbarNav">
						<ul className="navbar-nav">
							<li className="nav-item"><a className="nav-link" href="/">Home</a></li>
							<li className="nav-item"><a className="nav-link" href="/about">About</a></li>
						</ul>
					</div>
					<div className="navbar-collapse collapse w-100 order-3 navbarNav">
						<ul className="navbar-nav ml-auto">
							<li className="nav-item"> <Link className="nav-link" to={"/users/login"} >Login</Link></li>
							<li className="nav-item"><Link className="nav-link" to={"/users/register"}>Register</Link></li>
						</ul>
					</div>
				</div>
			</nav>
		)
	}
}

export default NavBar;


// render() {
// 	<nav className="navbar navbar-expand-lg navbar-light shadow-sm">
// 		<div className="container">
// 			<a className="navbar-brand" href="/">Matcha</a>
// 			<button className="navbar-toggler" type="button" data-toggle="collapse" data-target=".navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
// 				<span className="navbar-toggler-icon"></span>
// 			</button>
// 			<div className="collapse navbar-collapse navbarNav">
// 				<ul className="navbar-nav">
// 					<li className="nav-item"><a className="nav-link" href="/">Home</a></li>
// 					<li className="nav-item"><a className="nav-link" href="/about">About</a></li>
// 				</ul>
// 			</div>
// 			<div className="navbar-collapse collapse w-100 order-3 navbarNav">
// 				<ul className="navbar-nav ml-auto">
// 					<% if (isAuthenticated) { %>
// 						<li className="nav-item"><a className="nav-link" href="/users/profile">My Profile</a></li>
// 						<li className="nav-item"><a className="nav-link" href="/users/logout">Logout</a></li>
// 					<% } else { %>
// 						<li className="nav-item"><a className="nav-link" href="/users/login">Login</a></li>
// 						<li className="nav-item"><a className="nav-link" href="/users/register">Register</a></li>
// 					<% } %>
// 				</ul>
// 			</div>
// 		</div>
// 	</nav>
// }
