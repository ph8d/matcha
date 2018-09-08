import { observable, action, computed } from 'mobx';
import API from '../helpers/api';

class RegistrationStore {
	@observable isValidating = false;
	@observable step = 0;

	@observable user = {
		login: '',
		first_name: '',
		last_name: '',
		gender: 'not specified',
		searching_for: '*',
		bio: '',
		tags: [],
		birthdate: {
			month: '',
			day: '',
			year: ''
		},
		geolocation: {
			lat: 0,
			lng: 0,
			accurate: false
		}
	};

	@observable picture = {
		placeholder: `https://avatars.dicebear.com/v2/identicon/${Math.random() * (100 - 1) + 1}.svg`,
		file: '',
		src: '',
		croppData: null
	};

	@observable errors = {
		login: '',
		first_name: '',
		last_name: '',
		bio: '',
		tags: '',
		birthdate: '',
		picture: '',
	};

	@observable tagInput = '';

	@action setIsValidating(status) {
		this.isValidating = status;
	}

	@action loadDataFromLocalStore() {
		const data = localStorage.getItem('profileData');
		const step = parseInt(localStorage.getItem('registrationStep'), 10);

		if (data) {
			this.user = JSON.parse(data);
		}
		this.step = step || 1;
	}

	@action setGeolocation(location) {
		this.user.geolocation = location;
	}
	
	@action setErrors(errors) {
		Object.keys(errors).forEach(field => {
			this.errors[field] = errors[field];
		})
	}

	@action setFieldValue(fieldName, value) {
		this.user[fieldName] = value;
		this.errors[fieldName] = '';
	}

	@action setBirthDate(field, value) {
		if (value) {
			if (field === 'day' && !RegExp(/^[\d+]{1,2}$/).test(value)) {
				return;
			} else if (field === 'year' && !RegExp(/^[\d+]{1,4}$/).test(value)) {
				return;
			}
		}
		this.user.birthdate[field] = value;
		this.errors.birthdate = '';
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
	
	@action isValidPicture(file) {
		if (!file) return;
		if (!file.type.includes('image/')) {
			this.errors.avatar = 'Invalid file type.';
			return false;
		} else if (file.size > 3000000) { // 3MB in bytes
			this.errors.avatar = 'File is too big, max size is 3MB.'
			return false;
		}
		return true;
	}

	@action setPicture(file = '', src = '', croppData = null) {
		this.picture.file = file;
		this.picture.src = src;
		this.picture.croppData = croppData;
		this.errors.picture = '';
	}

	@action addTag() {
		if (this.isValidTag()) {
			this.user.tags.push(this.tagInput.trim());
			this.tagInput = '';
		}
	}

	@action removeTag(tag) {
		let index = this.user.tags.indexOf(tag);
		this.user.tags.splice(index, 1);
	}

	@action prevStep() {
		this.step--;
		localStorage.setItem('registrationStep', this.step);
	}

	@action nextStep() {
		this.validateCurrentStep()
			.then(validationErrors => {
				if (Object.keys(validationErrors).length > 0) {
					this.setErrors(validationErrors);
				} else {
					this.step++;
					localStorage.setItem('registrationStep', this.step);
					this.saveDataToLocalStore();
				}
			})
	}

	@action isValidTag() {
		if (!this.tagInput) return false;

		if (this.user.tags.indexOf(this.tagInput) !== -1) {
			this.errors.tags = 'This tag already exists.';
			return false;
		}

		return true;
	}

	@computed get birthDateJSObj() {
		const { birthdate } = this.user;
		return new Date(`${birthdate.month} ${birthdate.day}, ${birthdate.year}`);
	}

	@computed get birthDateSQLString() {
		const date = this.birthDateJSObj;
		return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}`;
	}

	isLoginAvalible() {
		return API.Users.exists(this.user.login)
			.then(response => {
				return !response.data.exists;
			});
	}

	clearLocalStore() {
		localStorage.removeItem('profileData');
		localStorage.removeItem('registrationStep');
	}

	saveDataToLocalStore() {
		localStorage.removeItem('profileData');
		localStorage.setItem('profileData', JSON.stringify(this.user));
	}

	getLocationByIp() {
		if (!this.user.geolocation.lat) {
			fetch('http://ip-api.com/json')
				.then(response => response.json())
				.then(location => {
					this.user.geolocation.lat = location.lat;
					this.user.geolocation.lng = location.lon;
				})
				.catch(console.error);
		}
	}

	getLocationWithNavigator() {
		if (this.user.geolocation.accurate) return;
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(pos => {
				let geolocation = {
					lat: pos.coords.latitude,
					lng: pos.coords.longitude,
					accurate: true
				}
				this.setGeolocation(geolocation);
				this.saveDataToLocalStore();
			}, error => {
				this.setErrors({ geolocation: error.message });
			});
		} else {
			this.setErrors({ geolocation: 'Geolocation is not enabled on this browser' });
		}
	}

	validateCurrentStep() { // This is an awful function, i need to rethink validation
		switch(this.step) {
			case 1:
				return this.validateFirstStep();
			case 3:
				return this.validateThirdStep();
			default:
				return Promise.resolve({});
		}
	}

	validateFirstStep() { // This is an awful function
		this.setIsValidating(true);
		return new Promise((resolve, reject) => {
			const { first_name, last_name, login, birthdate } = this.user;
			const errors = {};
	
			const isValidLogin = new RegExp(/^[A-Za-z0-9_]{4,24}$/);
			const isValidName = new RegExp(/^[A-Za-z- ]{1,32}$/);
			const isValidDay = RegExp(/^([1-9]|[12][0-9]|3[01])$/);
			const isValidYear = RegExp(/^(19[0-9][0-9])|(20[0-1][0-8])$/);
	
			if (!isValidName.test(first_name)) {
				errors.first_name = 'Names should be 1-32 characters long and can contain only letters and dashes.';
			}
			if (!isValidName.test(last_name)) {
				errors.last_name = 'Names should be 1-32 characters long and can contain only letters and dashes.';
			}
			if (!isValidLogin.test(login)) {
				errors.login = 'Login should be 4-24 symbols long and can contain only letters, numbers or a underline.';
			}
	
			if (!birthdate.month || birthdate.month === "0") {
				errors.birthdate = "Please, enter a valid month";
			} else if (!isValidDay.test(birthdate.day)) {
				errors.birthdate = "Please, enter a valid day";
			} else if (!isValidYear.test(birthdate.year)) {
				errors.birthdate = "Please, enter a valid year";
			}

			if (!errors.login) {
				this.isLoginAvalible()
					.then(status => {
						if (status === false) {
							errors.login = 'This login is already taken.';
						}
						this.setIsValidating(false);
						resolve(errors);
					})
			} else {
				this.setIsValidating(false);
				resolve(errors);
			}
		});
	}

	validateThirdStep() {
		const { tags, bio } = this.user;
		const errors = {};

		const isValidBio = new RegExp(/^[^>]{0,500}$/);

		if (!isValidBio.test(bio)) {
			errors.bio = "Bio can not contain '>' character. Max length is 500 symbols."
		}

		if (tags.length < 3) {
			errors.tags = "Please, add at least 3 tags."
		}

		return Promise.resolve(errors); // No-no-no-no-no, returning promise in sync function
	}
	
	verifyHash(hash) {
		return API.Auth.verify(hash);
	}

	submitInfo(hash) {
		const formData = new FormData();
		
		const profile = {
			login: this.user.login,
			first_name: this.user.first_name,
			last_name: this.user.last_name,
			gender: this.user.gender,
			searching_for: this.user.searching_for,
			bio: this.user.bio,
			birthdate: this.birthDateSQLString,
			lat: this.user.geolocation.lat,
			lng: this.user.geolocation.lng,
		}

		formData.append('profile', JSON.stringify(profile));
		this.user.tags.forEach(tag => {
			formData.append('tags[]', tag);
		});
		formData.append('picture', this.picture.file || this.picture.placeholder);
		formData.append('croppData', JSON.stringify(this.picture.croppData));
		
		return API.Users.createProfile(hash, formData);
	}

}

export default new RegistrationStore();