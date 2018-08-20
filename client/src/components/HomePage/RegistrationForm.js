import React from 'react';
import BaseInputField from '../BaseInputField';
import { observer, inject } from 'mobx-react';


@inject('AuthStore') @observer
class RegistrationForm extends React.Component {
	constructor(props) {
		super(props);

		this.onSubmit = this.onSubmit.bind(this);
		this.handleInput = this.handleInput.bind(this);
	}

	onSubmit(e) {
		e.preventDefault();
		let formData = new FormData(this.formElem);
		this.props.AuthStore.register(formData);
	}

	handleInput(e) {
		this.props.AuthStore.setFieldValue(e.target.name, e.target.value);
	}

	componentWillUnmount() {
		this.props.AuthStore.clearValues();
		this.props.AuthStore.clearErrors();
	}

	render() {
		const { values, errors, isLoading } = this.props.AuthStore;

		let btnStatus = isLoading ? 'disabled' : '';
		let btnLoadingClass = isLoading ? 'is-loading' : '';

		return (
			<form ref={form => this.formElem = form} onSubmit={this.onSubmit}>
				<BaseInputField
					value={values.first_name}
					name="first_name"
					labelText="First Name"
					type="text"
					error={errors.first_name}
					onChange={this.handleInput}
				/>

				<BaseInputField
					value={values.last_name}
					name="last_name"
					labelText="Last Name"
					type="text"
					error={errors.last_name}
					onChange={this.handleInput}
				/>

				<BaseInputField
					value={values.login}
					name="login"
					labelText="Login"
					type="text"
					error={errors.login}
					onChange={this.handleInput}
				/>

				<BaseInputField
					value={values.email}
					name="email"
					labelText="Email"
					type="email"
					error={errors.email}
					onChange={this.handleInput}
				/>

				<BaseInputField
					value={values.password}
					name="password"
					labelText="Password"
					type="password"
					error={errors.password}
					onChange={this.handleInput}
				/>

				<BaseInputField
					value={values.password_confirm}
					name="password_confirm"
					labelText="Confirm password"
					type="password"
					error={errors.password_confirm}
					onChange={this.handleInput}
				/>
				<hr/>
				<button disabled={btnStatus} id="submit" className={`button is-outlined is-medium is-fullwidth ${btnLoadingClass}`} type="submit" name="submit" value="OK">Register</button>
			</form>
		);
	}
}

export default RegistrationForm;
