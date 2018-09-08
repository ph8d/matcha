import { observable, action } from 'mobx';
import API from '../helpers/api';
import AuthStore from './AuthStore';

class UserStore {
	@observable isLoading = false;
	@observable currentUser = undefined;

	@action setIsLoading(status) {
		this.isLoading = status;
	}

	@action setCurrentUser(user) {
		this.currentUser = user;
	}

	@action pullUser() {
		return new Promise((resolve, reject) => {
			API.Users.getSelf()
				.then(response => {
					if (response.status === 401) { // If token is invalid
						AuthStore.logout();
					} else {
						let user = response.data;
						this.setCurrentUser(user);
						resolve(user);
					}
				})
				.catch(console.error);
		});
	}

	@action forgetUser() {
		this.currentUser = undefined;
	}

}

export default new UserStore();
