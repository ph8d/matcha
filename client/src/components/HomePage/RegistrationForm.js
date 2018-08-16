import React from 'react';
import BaseInputField from '../BaseInputField';
import axios from 'axios';

class RegistrationForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isValidating: false,
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
				Object.keys(newState.errors).forEach(field => {
					newState.errors[field] = '';
				})
				if (response.status === 200) {
					this.props.onSuccess();
				} else {
					console.log('handling errors')
					let errors = response.data;
					for (let field in errors) {
						newState.errors[field] = errors[field];
					}
					newState.isValidating = false;
					this.setState(newState);
				}
				console.log(this.state);
			})
			.catch(error => console.error);
	}

	renderForm() {
		let btnStatus = this.state.isValidating ? 'disabled' : '';

		return (
			<form ref={form => this.formElem = form} onSubmit={this.onSubmit}>
				<BaseInputField
					name="first_name"
					labelText="First Name"
					type="text"
					error={this.state.errors.first_name}
				/>

				<BaseInputField
					name="last_name"
					labelText="Last Name"
					type="text"
					error={this.state.errors.last_name}
				/>

				<BaseInputField
					name="login"
					labelText="Login"
					type="text"
					error={this.state.errors.login}
				/>

				<BaseInputField
					name="email"
					labelText="Email"
					type="email"
					error={this.state.errors.email}
				/>

				<BaseInputField
					name="password"
					labelText="Password"
					type="password"
					error={this.state.errors.password}
				/>

				<BaseInputField
					name="password_confirm"
					labelText="Confirm password"
					type="password"
					error={this.state.errors.password_confirm}
				/>
				<hr/>
				<button disabled={btnStatus} id="submit" className="button is-outlined is-medium is-fullwidth" type="submit" name="submit" value="OK">Register</button>
			</form>
		);
	}

	render() {
		return (
			this.renderForm()
		)
	}
}

export default RegistrationForm;
