import { observable, action } from 'mobx';

class Users {
	@observable all = [];
	@observable isLoading = false;
}

export default new Users();
