import React from 'react';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import MessageWindow from '../MessageWindow'
import { inject, observer } from 'mobx-react';

@inject('AuthStore') @observer
class SignedOutView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showLoginForm: true,
		}

		this.closeMessage = this.closeMessage.bind(this);
		this.showLoginForm = this.showLoginForm.bind(this);
		this.showRegisterForm = this.showRegisterForm.bind(this);
	}

	componentWillUnmount() {
		this.props.AuthStore.setMessageVisible(false);
	}

	showLoginForm(e) {
		if (this.state.showLoginForm) return;
		this.setState({ showLoginForm: true });
	}

	showRegisterForm(e) {
		if (!this.state.showLoginForm) return;
		this.setState({ showLoginForm: false });
	}

	closeMessage() {
		this.setState({ showLoginForm: true });
		this.props.AuthStore.setMessageVisible(false);
	}

	renderMessageWindow() {
		let { message } = this.props.AuthStore;
		return (
			<MessageWindow
				heading={ message.heading }
				text={ message.text }
				onButtonClick={ this.closeMessage }
			/>
		);
	}

	renderLoginOrRegistrationForm() {
		const currentForm = this.state.showLoginForm ? <LoginForm /> : <RegistrationForm onSuccess={this.onSuccess} />;
		const btnActiveClass = 'button is-dark is-radiusless';
		const btnInactiveClass = 'button is-outlined is-dark is-radiusless';

		return (
			<div className="card">
				<div className="card-content">
					<div className="buttons has-addons is-centered">
						<button className={this.state.showLoginForm ? btnInactiveClass : btnActiveClass} onClick={this.showRegisterForm}>
							<span className="icon is-size-7">
								<i className="fas fa-user-plus"></i>
							</span>
							<span>Register</span>
						</button>
						<button className={this.state.showLoginForm ? btnActiveClass : btnInactiveClass} onClick={this.showLoginForm}>
							<span className="icon is-size-7">
								<i className="fas fa-sign-in-alt"></i>
							</span>
							<span>Login</span>
						</button>
					</div>
					{currentForm}
				</div>
			</div>
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
								this.props.AuthStore.messageVisible ?
								this.renderMessageWindow() :
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
