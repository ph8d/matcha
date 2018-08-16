import { observable, action } from 'mobx';
import axios from 'axios';


class User {
	@observable isLoading = false;
	@observable signedIn = false;

	@action setIsLoading(status) {
		this.isLoading = status;
	}

	@action setSignedIn(status) {
		this.signedIn = status;
	}

	createSession(login, password) {
		return new Promise((resolve, reject) => {
			this.setIsLoading(true);
			axios.post('/users/login', {login, password})
				.then(response => {
					this.setIsLoading(false);
					if (response.status === 200) {
						localStorage.setItem('token', response.data.token);
						this.setSignedIn(true);
						resolve(response);
					}
				});
		});
	}
}

export default new User();
