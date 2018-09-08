import React from 'react';
import { Link } from 'react-router-dom';

class NavigationBox extends React.Component {
	render() {
		return (
			<div className="box">
				<aside className="menu">
					<p className="menu-label">Navigation</p>
					<ul className="menu-list">
						<li>
							<a className="is-active has-background-dark">
								<span className="icon is-size-7">
									<i className="fas fa-home"></i>
								</span>
								<span> My Profile</span>
							</a>
						</li>
						<li>
							<a>
								<span className="icon is-size-7">
									<i className="fas fa-search"></i>
								</span>
								<span> Browse</span>
							</a>
						</li>
						<li>
							<a>
								<span className="icon is-size-7">
									<i className="fas fa-comments"></i>
								</span>
								<span> Chats</span>
							</a>
						</li>
						<hr className="navbar-divider" />
						<li>
							<a>
								<span className="icon is-size-7">
									<i className="fas fa-sign-out-alt"></i>
								</span>
								<span> Logout</span>
							</a>
						</li>
					</ul>
				</aside>
			</div>
		);
	}
}

export default NavigationBox;