import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'

class NavBar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isActive: false
		}
	}

	expandMenu(e) {
		this.setState({ isActive: !this.state.isActive });
	}

	render() {
		const navMenuClass = this.state.isActive ? "navbar-menu is-active" : "navbar-menu";
		const navBurgerClass = this.state.isActive ? "navbar-burger is-active" : "navbar-burger";

		return (
			<nav className="navbar has-shadow is-transparent" aria-label="main navigation">
				<div className="container">
					<div className="navbar-brand">
						<Link className="navbar-item" to='/'>
							<strong>MATCHA</strong>
						</Link>
						<a onClick={this.expandMenu.bind(this)} role="button" className={navBurgerClass} aria-label="menu" aria-expanded="false">
							<span aria-hidden="true"></span>
							<span aria-hidden="true"></span>
							<span aria-hidden="true"></span>
						</a>
					</div>

					<div className={navMenuClass}>
						<div className="navbar-start">
							<Link className="navbar-item" to="/">Home</Link>
							<Link className="navbar-item" to="/about">About</Link>
						</div>

						<div className="navbar-end">
							
						</div>
					</div>
				</div>
			</nav>
		);
	}
}

export default NavBar;
