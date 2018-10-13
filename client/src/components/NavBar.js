import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'
import { inject, observer } from 'mobx-react';

@inject('AuthStore') @observer
class NavBar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isActive: false
		}

		this.logout = this.logout.bind(this);
	}

	logout() {
		this.props.AuthStore.logout();
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
						</div>

						<div className="navbar-end">
							<a onClick={this.logout} className="navbar-item">
								<span>Logout</span>
							</a>
						</div>
					</div>
				</div>
			</nav>
		);
	}
}

export default NavBar;
