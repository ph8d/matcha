import { observable, action, computed, toJS } from 'mobx'
import API from '../helpers/api'
import UserStore from './UserStore';
import moment from 'moment';

class ProfileEditStore {
	_editedFields = {};
	_tagsChanged = false;

	@observable user = null;
	@observable errors = {};

	@observable tagInput = '';

	@computed get numberOfTags() {
		return this.user.tags.length;
	}

	@computed get numberOfPictures() {
		return this.user.pictures.length;
	}

	@action setFieldValue(fieldName, value) {
		this.user.profile[fieldName] = value;
		this.errors[fieldName] = '';
		this._editedFields[fieldName] = value;
	}

	@action setBirthDate(fieldName, value) {
		this.user.profile.birthdate[fieldName] = value;
		this.errors.birthdate = '';
	}

	@action setProfilePicture(index) {
		const picture = this.user.pictures.splice(index, 1);
		this.user.pictures.unshift(picture[0]);
		const updatedPictures = toJS(this.user.pictures);
		UserStore.setPictures(updatedPictures);
	}

	@action pushNewPicture(picture) {
		this.user.pictures.push(picture);
		UserStore.setPictures(toJS(this.user.pictures));
	}

	@action splicePicture(index) {
		this.user.pictures.splice(index, 1);
	}

	@action setTagInput(value) {
		if (value.length > 30) {
			return this.errors.tags = 'Tag is too long.';
		} else if (!RegExp(/^[\w\- ]*$/).test(value)) {
			return this.errors.tags = 'Invalid symbol.'
		}

		this.tagInput = value;
		this.errors.tags = '';
	}

	@action addTag() {
		if (this._isValidTag()) {
			const tag = this.tagInput.trim();
			this.user.tags.push(tag);
			this.tagInput = '';
			this._tagsChanged = true;
		}
	}

	@action deleteTag(index) {
		this.user.tags.splice(index, 1);
		this._tagsChanged = true;
	}

	@action setErrors(errorsObj) {
		Object.keys(errorsObj).forEach(field => {
			this.errors[field] = errorsObj[field];
		});
	}

	@action loadUser() {
		const currentUser = toJS(UserStore.currentUser);
		let { profile, tags, pictures } = currentUser;
		profile.birthdate = this._birthDateToJSON(profile.birthdate);
		tags.forEach((tag, index) => {
			tags[index] = tag.value;
		});
		this.user = {
			profile,
			tags,
			pictures
		};
	}
	
	async changeProfilePicture(index) {
		const newProfilePicture = this.user.pictures[index];
		const profile = { picture_id: newProfilePicture.id }
		const response = await API.User.updateProfile({ profile });
		if (response.status === 200) {
			this.setProfilePicture(index);
		}
	}

	async uploadPicture(file, croppData) {
		const formData = new FormData();
		formData.append('picture', file);
		formData.append('croppData', JSON.stringify(croppData));
		const response = await API.Pictures.upload(formData);
		if (response.status === 200) {
			this.pushNewPicture(response.data);
		} else {
			this.setErrors({ pictures: 'Some server side error occured' });
		}
	}
	
	async deletePicture(index) {
		const pictureToDelete = this.user.pictures[index];
		const response = await API.Pictures.delete(pictureToDelete.id);
		if (response.status === 200) {
			this.splicePicture(index);
			UserStore.splicePicture(index);
		} else {
			this.setErrors({ pictures: 'Some server side error occured' });
		}
	}
	
	async updateProfile() {
		const valid = await this.isValidProfileFields();
		
		if (valid) {
			const body = {};
			const fieldsToSend = this._getChangedFields();
			
			if (Object.keys(fieldsToSend).length > 0) {
				body.profile = fieldsToSend;
			}
			
			if (this._tagsChanged) {
				body.tags = this.user.tags;
			}
			
			if (Object.keys(body).length > 0) {
				const response = await API.User.updateProfile(body);
				const updatedUser = response.data;
				UserStore.updateUser(updatedUser);
				this.resetStore();
				return;
			}
		}
	}
	
	async isValidProfileFields() {
		const errors = await this._validate();
		if (Object.keys(errors).length > 0) {
			this.setErrors(errors);
			return false;
		}
		return true;
	}
	
	unsetUser() {
		this.user = null;
	}

	resetStore() {
		this.errors = {};
		this.tagInput = '';
		this._editedFields = {};
		this._tagsChanged = false;
	}

	locateWithNavigator() {
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(pos => {
				this.setFieldValue('lat', pos.coords.latitude);
				this.setFieldValue('lng', pos.coords.longitude);
			}, error => {
				this.setErrors({ geolocation: error.message });
			});
		} else {
			this.setErrors({ geolocation: 'Geolocation is not enabled on this browser' });
		}
	}
	
	_getChangedFields() {
		const currentUserProfile = UserStore.currentUser.profile;
		const editedFields = this._editedFields;
		const result = {};

		Object.keys(editedFields).forEach(field => {
			if (currentUserProfile[field] !== editedFields[field]) {
				result[field] = editedFields[field];
			}
		});

		const dateJSON = this.user.profile.birthdate;
		const date = moment(`${dateJSON.year}-${dateJSON.month}-${dateJSON.day}`, 'YYYY-M-D');
		const currentBirthdate = moment(currentUserProfile.birthdate);

		if (date.format('L') !== currentBirthdate.format('L')) {
			result.birthdate = date.format('YYYY-MM-DD');
		}

		return result;
	}

	_birthDateToJSON(birthdateString) {
		const birthDateFull = moment(birthdateString);
		return {
			month: birthDateFull.format('M'),
			day: birthDateFull.format('D'),
			year: birthDateFull.format('YYYY'),
		};
	}

	_isValidTag() {
		if (!this.tagInput) return false;

		if (this.user.tags.includes(this.tagInput)) {
			this.errors.tags = 'This tag already exists.';
			return false;
		}

		return true;
	}

	async _isLoginAvalible(login) {
		const currentLogin = UserStore.currentUser.profile.login;
		if (login === currentLogin) return true;

		const response = await API.User.exists(login)
		return !response.data.exists;
	}

	async _validate() {
		const isValidLogin = new RegExp(/^[A-Za-z0-9_]{4,24}$/);
		const isValidName = new RegExp(/^[A-Za-z- ]{1,32}$/);
		const isValidDay = RegExp(/^([1-9]|[12][0-9]|3[01])$/);
		const isValidYear = RegExp(/^(19[0-9][0-9])|(20[0-1][0-8])$/);
		const isValidBio = new RegExp(/^[\x00-\x7F]{0,500}$/);

		const { first_name, last_name, login, birthdate, bio } = this.user.profile;
		const { tags } = this.user;
		const errors = {};

		if (!isValidName.test(first_name)) {
			errors.first_name = 'Names should be 1-32 characters long and can contain only letters and dashes.';
		}
		if (!isValidName.test(last_name)) {
			errors.last_name = 'Names should be 1-32 characters long and can contain only letters and dashes.';
		}
		if (!isValidLogin.test(login)) {
			errors.login = 'Login should be 4-24 symbols long and can contain only letters, numbers or a underline.';
		}
		if (!isValidBio.test(bio)) {
			errors.bio = "Bio can contain only ascii characters. Max length is 500 symbols."
		}
		if (!isValidYear.test(birthdate.year)) {
			errors.birthdate = "Please, enter a valid year";
		}
		if (!birthdate.month || birthdate.month === "0") {
			errors.birthdate = "Please, enter a valid month";
		}
		if (!isValidDay.test(birthdate.day)) {
			errors.birthdate = "Please, enter a valid day";
		}
		if (!errors.login) {
			const logingIsAvalible = await this._isLoginAvalible(login);
			if (!logingIsAvalible) {
				errors.login = 'This login is already taken.';
			}
		}
		if (tags.length < 3) {
			errors.tags = "You need at leest 3 tags.";
		}

		return errors;
	}
}

export default new ProfileEditStore();
