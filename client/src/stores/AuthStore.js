import { observable, action } from "mobx";
import API from '../helpers/api';
import CommonStore from './CommonStore';
import UserStore from './UserStore';
import ConversationStore from './ConversationStore';

class AuthStore {
	@observable isLoading = false;

	@observable values = {
		email: '',
		password: '',
		password_confirm: '',
	};

	@observable errors = {
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
		this.errors.email = '';
		this.errors.password = '';
		this.errors.password_confirm = '';
	}

	@action clearValues() {
		this.values.email = '';
		this.values.password = '';
		this.values.password_confirm = '';
	}

	@action displayErrors(errors) {
		console.log(errors);
		if (!errors) return;
		errors.forEach(error => {
			this.errors[error.fieldName] = error.msg
		});
	}

	async login() {
		this.setIsLoading(true);

		const credentials = {
			email: this.values.email,
			password: this.values.password
		};

		const response = await API.Auth.login(credentials);
		console.log(response);
		if (response.status !== 200) {
			this.displayErrors(response.data.errors);
		} else {
			CommonStore.setToken(response.data.token);
			UserStore.pullUser();
			ConversationStore.pullConversations();
		}

		this.setIsLoading(false);
	}

	async register() {
		this.setIsLoading(true);
		
		const userData = { ...this.values };
		const response = await API.Auth.register(userData);
		
		this.clearErrors();

		if (response.status !== 200) {
			this.displayErrors(response.data.errors);
		} else {
			this.message = {
				heading: "Success!",
				text: response.data.message,
			}
			this.setMessageVisible(true);
		}
		this.setIsLoading(false);
	}

	async accountRecovery() {
		if (!this.values.email) {
			return this.displayErrors([{ fieldName: 'email', msg: 'Please, enter your email first.' }]);
		}

		this.setIsLoading(true);

		const response = await API.Auth.recovery(this.values.email);
		if (response.status === 202) {
			this.displayErrors(response.data);
		} else {
			this.message = {
				heading: "Account Recovery",
				text: response.data.message,
			}
			this.setMessageVisible(true);
		}

		this.setIsLoading(false);
	}

	async passwordReset(hash) {
		if (this.values.password !== this.values.password_confirm) {
			return this.displayErrors([{ fieldName: 'password_confirm', msg: "Passwords doesn't match." }]);
		}

		this.setIsLoading(true);

		let password = this.values.password;
		const response = await API.Auth.reset({ hash, password });

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

		this.setIsLoading(false);
		return response;
	}

	async verifyHash(hash) {
		const response = await API.Auth.verifyRecoveryReq(hash);
		if (response.status !== 200) {
			console.error(response);
			return false;
		}
		return response.data.status;
	}

	logout() {
		CommonStore.setToken(undefined);
		UserStore.forgetUser();
		ConversationStore.clearConversations();
	}
}

export default new AuthStore();
