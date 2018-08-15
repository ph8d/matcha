import React from 'react';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import '../App.css'


class RegistrationPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			showLoginForm: false
		}

		this.toggleRegisterForm = this.toggleRegisterForm.bind(this);
		this.toggleLoginForm = this.toggleLoginForm.bind(this);
	}

	toggleRegisterForm(e) {
		this.setState({ showLoginForm: false} );
		e.target.className = "button is-active";
	}

	toggleLoginForm(e) {
		this.setState({ showLoginForm: true} );
		e.target.className = "button is-active";
	}

	renderLoginForm() {
		return <LoginForm/>;
	}

	renderRegisterForm() {
		return <RegistrationForm/>;
	}

	render() {
		const currentForm = this.state.showLoginForm ? this.renderLoginForm() : this.renderRegisterForm();
		const btnActiveClass = 'button is-active';
		const btnInactiveClass = 'button';

		return (
			<section className="hero is-medium is-bold is-white">
				<div className="hero-body">
					<div className="columns is-centered">
						<div className="column is-4">
							<h1 className="title">Matcha</h1>
							<h2 className="subtitle">Your love is one click away</h2>
						</div>
						<div className="column is-4">
						<div className="card">
							<div className="card-content">
								<div className="field has-addons content">
									<p className="control">
										<button className={this.state.showLoginForm ? btnInactiveClass : btnActiveClass} onClick={this.toggleRegisterForm}>
											Register
										</button>
									</p>
									<p className="control">
										<button className={this.state.showLoginForm ? btnActiveClass : btnInactiveClass} onClick={this.toggleLoginForm}>
											Login
										</button>
									</p>
								</div>
								{currentForm}
							</div>
						</div>
						</div>
					</div>
				</div>
			</section>
		);
	}
}

export default RegistrationPage;
