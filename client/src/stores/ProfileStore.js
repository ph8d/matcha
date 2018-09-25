import { observable, action, computed } from 'mobx';
import API from '../helpers/api';
import SocketStore from './SocketStore';

class ProfileStore {
	@observable actionInProcess = false;
	
	@observable user = undefined;

	@action setActionInProcess(status) {
		this.actionInProcess = status;
	}

	@action setUser(user) {
		this.user = user;
	}
	
	@action setIsBlocked(status) {
		this.user.status.isBlocked = status;
	}


	@action setIsLiked(status) {
		this.user.status.isLiked = status;
	}

	@action setIsMatch(status) {
		this.user.status.isMatch = status;
	}

	async loadUser(login){
		const response = await API.User.get(login);
		if (response.status !== 200) {
			console.error(response);
		} else {
			this.setUser(response.data);
			SocketStore.emit('profile visit', this.user.profile.user_id);
		}
	}

	async like() {
		this.setActionInProcess(true);
		const response = await API.User.like(this.user.profile.login);
		if (response.status !== 200) {
			console.error(response);
		} else {
			console.log(`liked ${this.user.profile.login}`);
			this.setIsLiked(true);
		}
		this.setActionInProcess(false);
	}

	async unlike() {
		this.setActionInProcess(true);
		const response = await API.User.unlike(this.user.profile.login);
		if (response.status !== 200) {
			console.error(response);
		} else {
			console.log(`unliked ${this.user.profile.login}`);
			this.setIsLiked(false);
		}
		this.setActionInProcess(false);
	}

	async block() {
		this.setActionInProcess(true);
		const response = await API.User.block(this.user.profile.login);
		if (response.status !== 200) {
			console.error(response);
		} else {
			console.log(`blocked ${this.user.profile.login}`);
			this.setIsBlocked(true);
		}
		this.setActionInProcess(false);
	}

	async unblock() {
		this.setActionInProcess(true);
		const response = await API.User.unblock(this.user.profile.login);
		if (response.status !== 200) {
			console.error(response);
		} else {
			console.log(`unblocked ${this.user.profile.login}`);
			this.setIsBlocked(false);
		}
		this.setActionInProcess(false);
	}

	async report(reason) {
		this.setActionInProcess(true);
		const response = await API.User.report(this.user.profile.login, reason);
		if (response.status !== 200) {
			console.error(response);
		} else {
			console.log(`reported ${this.user.profile.login}`);
		}
		this.setActionInProcess(false);
	}
}

export default new ProfileStore();
