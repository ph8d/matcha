import React from 'react';
import { Link } from 'react-router-dom';
import BaseInputField from '../BaseInputField';
import { observer, inject } from 'mobx-react';

@inject('user') @observer
class LoginForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			login: '',
			password: '',
			isLoading: false,
		}

		this.handleInput = this.handleInput.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	handleInput(e) {
		this.setState({ [e.target.name]: e.target.value });
	}

	onSubmit(e) {
		e.preventDefault();
		this.setState({ isLoading: true });
		this.props.user.createSession(this.state.login, this.state.password)
			.then(response => {
				if (response.status !== 200) {
					// Need to display error msg
				}
				this.setState({ isLoading: false });
			});
	}

	renderForm() {
		let btnStatus = this.state.isValidating ? 'disabled' : '';

		return (
			<form ref={form => this.formElem = form} onSubmit={this.onSubmit}>
				<BaseInputField
					name="login"
					labelText="Login"
					type="text"
					value={this.state.login}
					onChange={this.handleInput}
				/>

				<BaseInputField
					name="password"
					labelText="Password"
					type="password"
					value={this.state.password}
					onChange={this.handleInput}
				/>
				<Link className="is-size-7 has-text-link" to="/users/reset">Forgot your password?</Link>
				<hr/>
				<button disabled={btnStatus} id="submit" className="button is-outlined is-medium is-fullwidth" type="submit" name="submit" value="OK">Login</button>
			</form>
		);
	}

	render() {
		return (
			this.renderForm()
		);
	}
}

export default LoginForm;
