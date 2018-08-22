import { observable, action } from "mobx";
import API from '../helpers/api';
import CommonStore from './CommonStore';
import UserStore from './UserStore';

class AuthStore {
	@observable isLoading = false;

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

	@observable messageVisible = false;
	message = {
		heading: '',
		text: ''
	};

	@action setIsLoading(status) {
		this.isLoading = status;
	}

	@action setMessageVisible(status) {
		this.messageVisible = status;
	}

	@action setFieldValue(fieldName, value) {
		this.values[fieldName] = value;
		this.errors[fieldName] = '';
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
		this.setIsLoading(true);
		let credentials = {
			email: this.values.email,
			password: this.values.password
		};
		API.Auth.login(credentials)
			.then(response => {
				if (response.status === 200) {
					CommonStore.setToken(response.data.token);
					return UserStore.pullUser();
				}
				// I need to add global error handling
			})
			.catch(console.error)
			.then(() => this.setIsLoading(false));
		}

	@action register() {
		this.setIsLoading(true);
		let userData = { ...this.values };
		API.Auth.register(userData)
			.then(response => {
				this.clearErrors();
				if (response.status === 202) {
					this.displayErrors(response.data);
				} else {
					this.message = {
						heading: "Registration successful!",
						text: response.data.message,
					}
					this.setMessageVisible(true);
				}
			})
			.catch(console.error)
			.then(() => this.setIsLoading(false));
	}

	@action accountVerification(hash) {
		this.setIsLoading(true);
		return API.Auth.verify(hash).then(response => {
			if (response.status === 200) {
				this.message = {
					heading: "Account verification",
					text: response.data.message,
				};
				this.setMessageVisible(true);
			}
			return response;
		})
		.catch(console.error)
		.then(response => {
			this.setIsLoading(false);
			return response;
		})
	}

	@action accountRecovery() {
		if (!this.values.email) {
			this.errors.email = 'Please, enter your email first.';
		} else {
			this.setIsLoading(true);
			API.Auth.recovery(this.values.email)
				.then(response => {
					if (response.status === 202) {
						this.displayErrors(response.data);
					} else {
						this.message = {
							heading: "Account Recovery",
							text: response.data.message,
						}
						this.setMessageVisible(true);
					}
				})
				.catch(console.error)
				.then(() => this.setIsLoading(false));
		}
	}

	@action passwordReset(hash) {
		if (this.values.password !== this.values.password_confirm) {
			this.errors.email = 'Please, enter your email first.';
		}
		this.setIsLoading(true);
		let password = this.values.password;
		return API.Auth.reset({ hash, password })
			.then(response => {
				this.clearErrors();
				if (response.status === 202) {
					this.displayErrors(response.data);
				} else {
					this.message = {
						heading: "Password reset",
						text: response.data.message,
					}
					this.setMessageVisible(true);
				}
				return response;
			})
			.catch(console.error)
			.then(response => { // All async methods should return a promise with response object
				this.setIsLoading(false);
				return response;
			})
	}

	@action logout() {
		CommonStore.setToken(undefined);
		UserStore.forgetUser();
	}
}

export default new AuthStore();
