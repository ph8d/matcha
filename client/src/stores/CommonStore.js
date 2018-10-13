import { observable, action, reaction } from 'mobx'

class CommonStore {
	socket = null;

	@observable token = window.localStorage.getItem('jwt');
	@observable appLoaded = false;

	@action setToken(token) {
		this.token = token;
	}

	@action setAppLoaded(status) {
		this.appLoaded = status;
	}
}

const store = new CommonStore();

reaction(() => store.token, token => {
	if (token) {
		window.localStorage.setItem('jwt', token);
	} else {
		window.localStorage.removeItem('jwt');
	}
});

export default store;