import { observable, action } from 'mobx';


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
		this.setIsLoading(true);
		this.setIsLoading(false);
	}
}
