import React from 'react';
import { Redirect } from 'react-router-dom';
import BaseInputField from './BaseInputField';
import BootstrapAlert from './BootstrapAlert';
import axios from 'axios';

class RegistrationForm extends React.Component {
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
		axios.post('/users/', formData)
			.then(response => {
				newState.isValidating = false;
				Object.keys(newState.errors).forEach(field => {
					newState.errors[field] = '';
				})
				if (response.status === 200) {
					newState.success = true;
				} else {
					console.log('handling errors')
					let errors = response.data;
					for (let field in errors) {
						newState.errors[field] = errors[field];
					}
				}
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
				<div className="row">
					<BaseInputField
						className="col-md-6 mb-3"
						name="first_name"
						labelText="First Name"
						type="text"
						error={this.state.errors.first_name}
					/>

					<BaseInputField
						className="col-md-6 mb-3"
						name="last_name"
						labelText="Last Name"
						type="text"
						error={this.state.errors.last_name}
					/>
				</div>

				<BaseInputField
					className="mb-3"
					name="login"
					labelText="Login"
					type="text"
					error={this.state.errors.login}
				/>

				<BaseInputField
					className="mb-3"
					name="email"
					labelText="Email"
					type="email"
					error={this.state.errors.email}
				/>

				<BaseInputField
					className="mb-3"
					name="password"
					labelText="Password"
					type="password"
					error={this.state.errors.password}
				/>

				<BaseInputField
					className="mb-3"
					name="password_confirm"
					labelText="Confirm password"
					type="password"
					error={this.state.errors.password_confirm}
				/>
				<hr className="mb-4"/>
				<button disabled={btnStatus} id="submit" className="btn btn-primary btn-lg btn-block" type="submit" name="submit" value="OK">Register</button>
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

export default RegistrationForm;
