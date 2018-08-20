import { observable, action } from "mobx";
import API from '../helpers/api';
import CommonStore from './CommonStore';
import UserStore from './UserStore';

class AuthStore {
	@observable isLoading = false;
	@observable registrationSuccess = false

	@observable values = { // I can implement client side validation here
		first_name: '',
		last_name: '',
		login: '',
		email: '',
		password: '',
		password_confirm: '',
	};

	@observable errors = {
		first_name: '',
		last_name: '',
		login: '',
		email: '',
		password: '',
		password_confirm: '',
	};

	@action setRegistrationSuccess(status) {
		this.registrationSuccess = status;
	}

	@action setFieldValue(fieldName, value) {
		this.values[fieldName] = value;
	}

	@action clearErrors() {
		this.errors.first_name = '';
		this.errors.last_name = '';
		this.errors.login = '';
		this.errors.email = '';
		this.errors.password = '';
		this.errors.password_confirm = '';
	}

	@action clearValues() {
		this.values.first_name = '';
		this.values.last_name = '';
		this.values.login = '';
		this.values.email = '';
		this.values.password = '';
		this.values.password_confirm = '';
	}

	@action displayErrors(errors) {
		for (let field in errors) {
			this.errors[field] = errors[field];
		}
	}

	@action login() {
		this.isLoading = true;
		let credentials = {
			email: this.values.email,
			password: this.values.password
		};
		return API.Auth.login(credentials)
			.then(response => {
				if (response.status === 200) {
					CommonStore.setToken(response.data.token);
					return UserStore.pullUser();
				}
				// I need to add global error handling
			})
			.then(user => {
				this.isLoading = false;
			})
			.catch(console.error);
	}

	@action register() {
		this.isLoading = true;
		let userData = { ...this.values };
		API.request('POST', '/users/register', userData)
			.then(response => {
				this.clearErrors();
				if (response.status === 202) {
					this.displayErrors(response.data);
				} else {
					this.setRegistrationSuccess(true);
				}
			})
			.catch(console.error)
			.then(() => this.isLoading = false);
	}

	@action logout() {
		CommonStore.setToken(undefined);
		UserStore.forgetUser();
	}
}

export default new AuthStore();
