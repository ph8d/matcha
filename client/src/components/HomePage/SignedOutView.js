import React from 'react';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import Notification from '../Notification'

class SignedOutView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			showLoginForm: true,
			registrationSuccess: false
		}

		this.switchForm = this.switchForm.bind(this);
		this.onSuccess = this.onSuccess.bind(this);
	}

	onSuccess() {
		console.log('registration success');
		this.setState({ registrationSuccess: true });
	}

	switchForm(e) {
		if (e.target.className === 'button is-active') return;
		this.setState({ showLoginForm: !this.state.showLoginForm });
	}

	renderLoginOrRegistrationForm() {
		const currentForm = this.state.showLoginForm ? <LoginForm /> : <RegistrationForm onSuccess={this.onSuccess} />;
		const btnActiveClass = 'button is-active';
		const btnInactiveClass = 'button';

		return (
			<div className="card">
				<div className="card-content">
					<div className="field has-addons content">
						<p className="control">
							<button className={this.state.showLoginForm ? btnInactiveClass : btnActiveClass} onClick={this.switchForm}>
								Register
							</button>
						</p>
						<p className="control">
							<button className={this.state.showLoginForm ? btnActiveClass : btnInactiveClass} onClick={this.switchForm}>
								Login
							</button>
						</p>
					</div>
					{currentForm}
				</div>
			</div>
		);
	}

	renderSuccessMsg() {
		return (
			<Notification
				heading="Registration successful!"
				msg="Please, check your email."
			/>
		);
	}

	render() {
		return (
			<section className="hero is-medium is-bold is-white">
				<div className="hero-body">
					<div className="columns is-centered">
						<div className="column is-4">
							<h1 className="title">Matcha</h1>
							<h2 className="subtitle">Your love is one click away</h2>
						</div>
						<div className="column is-4">
							{
								this.state.registrationSuccess ?
								this.renderSuccessMsg() :
								this.renderLoginOrRegistrationForm()
							}
						</div>
					</div>
				</div>
			</section>
		);
	}
}

export default SignedOutView;
