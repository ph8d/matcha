import React from 'react';
import { Redirect } from 'react-router-dom';
import BaseInputField from './BaseInputField';
import BootstrapAlert from './BootstrapAlert';
import axios from 'axios';

class LoginForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isValidating: false,
			success: false,
			errors: {
				first_name: '',
				last_name: '',
				login: '',
				email: '',
				password: '',
				password_confirm: '',
			}
		}

		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(e) {
		e.preventDefault();

		let formData = new FormData(this.formElem);
		let newState = { ...this.state, isValidating: true };
		this.setState(newState);
		axios.post('/users/login', formData)
			.then(response => {
				newState.isValidating = false;
				if (response.status === 200) {
					newState.success = true;
				}
				console.log(response);
				this.setState(newState);
				console.log(this.state);
			})
			.catch(error => console.error);
	}

	renderSuccessMessage() {
		return (
			<BootstrapAlert
				heading="Registration successful!"
				msg="Please, check your email."
			/>
		)
	}

	renderForm() {
		let btnStatus = this.state.isValidating ? 'disabled' : '';

		return (
			<form ref={form => this.formElem = form} onSubmit={this.onSubmit}>
				<BaseInputField
					name="login"
					labelText="Login"
					type="text"
					error={this.state.errors.login}
				/>

				<BaseInputField
					name="password"
					labelText="Password"
					type="password"
					error={this.state.errors.password}
				/>
				<hr/>
				<button disabled={btnStatus} id="submit" className="button is-outlined is-medium is-fullwidth" type="submit" name="submit" value="OK">Login</button>
			</form>
		);
	}

	render() {
		return (
			this.state.success ?
			this.renderSuccessMessage() :
			this.renderForm()
		)
	}
}

export default LoginForm;
