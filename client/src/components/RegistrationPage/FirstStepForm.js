import React from 'react'
import { observer, inject } from 'mobx-react';
import BaseInputField from '../BaseInputField';
import BirthDateInput from '../BirthDateInput';

@inject('RegistrationStore') @observer
class FirstStepForm extends React.Component {
	constructor(props) {
		super(props);
		this.handleInput = this.handleInput.bind(this);
		this.handleBirthdateChange = this.handleBirthdateChange.bind(this);
	}

	handleInput(e) {
		this.props.RegistrationStore.setFieldValue(e.target.name, e.target.value);
	}

	handleBirthdateChange(e) {
		this.props.RegistrationStore.setBirthDate(e.target.name, e.target.value);
	}

	render() {
		let { user, errors } = this.props.RegistrationStore;

		return (
			<div>
				<BaseInputField
					value={user.first_name}
					name="first_name"
					labelText="First Name"
					type="text"
					placeholder="John"
					error={errors.first_name}
					onChange={this.handleInput}
				/>

				<BaseInputField
					value={user.last_name}
					name="last_name"
					labelText="Last Name"
					type="text"
					placeholder="Doe"
					error={errors.last_name}
					onChange={this.handleInput}
				/>

				<BaseInputField
					value={user.login}
					name="login"
					labelText="Login"
					type="text"
					placeholder="john_doe"
					error={errors.login}
					onChange={this.handleInput}
				/>

				<BirthDateInput
					labelText="Birthday"
					month={user.birthdate.month}
					day={user.birthdate.day}
					year={user.birthdate.year}
					error={errors.birthdate}
					onChange={this.handleBirthdateChange}
				/>
			</div>
		);
	}
}

export default FirstStepForm;
