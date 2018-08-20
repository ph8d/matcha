import React from 'react';
import { Link } from 'react-router-dom';
import BaseInputField from '../BaseInputField';
import { inject, observer } from 'mobx-react';

@inject('AuthStore') @observer
class LoginForm extends React.Component {
	constructor(props) {
		super(props);

		this.handleInput = this.handleInput.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	handleInput(e) {
		this.props.AuthStore.setFieldValue(e.target.name, e.target.value);
	}

	onSubmit(e) {
		e.preventDefault();
		this.props.AuthStore.login();
	}

	componentWillUnmount() {
		this.props.AuthStore.clearValues();
		this.props.AuthStore.clearErrors();
	}

	render() {
		const { values, isLoading } = this.props.AuthStore;

		let btnStatus = isLoading ? 'disabled' : '';
		let btnLoadingClass = isLoading ? 'is-loading' : '';

		return (
			<form ref={form => this.formElem = form} onSubmit={this.onSubmit}>
				<BaseInputField
					name="email"
					labelText="Email"
					type="email"
					value={values.email}
					onChange={this.handleInput}
				/>

				<BaseInputField
					name="password"
					labelText="Password"
					type="password"
					value={values.password}
					onChange={this.handleInput}
				/>
				<Link className="is-size-7 has-text-link" to="/users/reset">Forgot your password?</Link>
				<hr/>
				<button disabled={btnStatus} id="submit" className={`button is-outlined is-medium is-fullwidth ${btnLoadingClass}`} type="submit" name="submit" value="OK">Login</button>
			</form>
		);
	}
}

export default LoginForm;
