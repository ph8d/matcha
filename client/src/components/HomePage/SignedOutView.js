import React from 'react';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import MessageBox from '../MessageBox'
import { inject, observer } from 'mobx-react';

@inject('AuthStore') @observer
class SignedOutView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showLoginForm: true,
		}

		this.switchForm = this.switchForm.bind(this);
		this.closeMessage = this.closeMessage.bind(this);
	}

	componentWillUnmount() {
		this.props.AuthStore.setMessageVisible(false);
		this.props.AuthStore.clearErrors();
	}

	switchForm(e) {
		if (!e.target.className.includes('is-outlined')) return;
		this.setState({ showLoginForm: !this.state.showLoginForm });
	}

	closeMessage() {
		this.setState({ showLoginForm: true });
		this.props.AuthStore.setMessageVisible(false);
	}

	renderMessageBox() {
		let { message } = this.props.AuthStore;
		return (
			<MessageBox
				heading={ message.heading }
				text={ message.text }
				onButtonClick={ this.closeMessage }
			/>
		);
	}

	renderLoginOrRegistrationForm() {
		const currentForm = this.state.showLoginForm ? <LoginForm /> : <RegistrationForm onSuccess={this.onSuccess} />;
		const btnActiveClass = 'button is-dark';
		const btnInactiveClass = 'button is-outlined is-dark';

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
								this.renderMessageBox() :
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
