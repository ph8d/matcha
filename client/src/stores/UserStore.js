import { observable, action, computed, toJS } from 'mobx';
import API from '../helpers/api';
import AuthStore from './AuthStore';
import SocketStore from './SocketStore';

class UserStore {
	@observable isLoading = false;
	@observable currentUser = undefined;
	
	@observable input = {}

	@action setIsLoading(status) {
		this.isLoading = status;
	}

	@action setCurrentUser(user) {
		this.currentUser = user;
	}

	@action setPictures(pictures) {
		this.currentUser.pictures = pictures;
	}

	@action setNotificationsSeen() {
		const len = this.currentUser.notifications.length;
		for (let i = 0; i < len; i++) {
			this.currentUser.notifications[i].seen = 1;
		}
		SocketStore.emit('notifications seen', this.user_id);
	}

	@action pushNewNotification(notification) {
		const len = this.currentUser.notifications.length;
		for (let i = 0; i < len; i++) {
			if (this.currentUser.notifications[i].id === notification.id) {
				this.currentUser.notifications.splice(i, 1);
				break ;
			}
		}
		this.currentUser.notifications.unshift(notification);
	}

	@computed get user_id() {
		return this.currentUser.profile.user_id;
	}

	@computed get unseenNotificationsCount() {
		let unseen = 0;
		const { notifications } = this.currentUser;
		notifications.forEach(notification => {
			if (notification.seen === 0){
				unseen++;
			}
		});
		return unseen;
	}

	@action updateUser(updatedUser) {
		const { profile, tags } = updatedUser;
	
		if (tags) {
			this.currentUser.tags = tags;
		}
	
		if (profile) {
			Object.keys(profile).forEach(filed => {
				this.currentUser.profile[filed] = profile[filed];
			});
		}
	}

	@action splicePicture(index) {
		this.currentUser.pictures.splice(index, 1);
	}

	async pullUser() {
		try {
			const response = await API.User.getSelf();
			if (response.status === 401) { // If token is invalid
				AuthStore.logout();
			} else {
				let user = response.data;
				this.setCurrentUser(user);
				SocketStore.connect(user.profile.user_id);
			}
		} catch (e) {
			console.error(e);
		}
	}


	@action forgetUser() {
		this.currentUser = undefined;
		SocketStore.disconnect();
	}

}

export default new UserStore();
