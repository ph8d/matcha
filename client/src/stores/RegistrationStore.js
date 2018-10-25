import { observable, action, computed } from 'mobx';
import API from '../helpers/api';
import moment from 'moment';

class RegistrationStore {
	@observable isValidating = false;
	@observable step = 1;

	@observable user = {
		login: '',
		first_name: '',
		last_name: '',
		gender: 'male',
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
		if (data) {
			try {
				this.user = JSON.parse(data);
			} catch (e) {
				localStorage.removeItem('profileData');
			}
		}
	}

	@action setGeolocation(location) {
		this.user.geolocation = location;
	}
	
	@action setErrors(errors) {
		errors.forEach(error => {
			const { fieldName, msg } = error;
			this.errors[fieldName] = msg;
		});
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
			this.errors.picture = 'Invalid file type.';
			return false;
		} else if (file.size > 3000000) { // 3MB in bytes
			this.errors.picture = 'File is too big, max size is 3MB.'
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

	@action removeTag(index) {
		this.user.tags.splice(index, 1);
	}

	@action prevStep() {
		this.step--;
	}

	@action async nextStep() {
		const validationErrors = await this.validateCurrentStep();
		if (validationErrors.length > 0) {
			this.setErrors(validationErrors);
		} else {
			this.step++;
			this.saveDataToLocalStore();
		}
	}

	@action isValidTag() {
		if (!this.tagInput) return false;

		if (this.user.tags.indexOf(this.tagInput) !== -1) {
			this.errors.tags = 'This tag already exists.';
			return false;
		}

		return true;
	}

	@computed get birthDateSQLString() {
		const dateJSON = this.user.birthdate;
		const date = moment(`${dateJSON.year}-${dateJSON.month}-${dateJSON.day}`, 'YYYY-M-D');
		return date.format('YYYY-MM-DD');
	}

	async isLoginAvalible() {
		const response = await API.User.exists(this.user.login);
		return !response.data.exists;
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
			fetch('https://ipapi.co/json')
				.then(response => response.json())
				.then(response => {
					this.user.geolocation.lat = response.latitude;
					this.user.geolocation.lng = response.longitude;
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

	validateCurrentStep() {
		switch(this.step) {
			case 1:
				return this.validateFirstStep();
			case 3:
				return this.validateThirdStep();
			case 4:
				return this.validateFourthStep();
			default:
				return Promise.resolve([]);
		}
	}

	async validateFirstStep() {
		this.setIsValidating(true);

		const isValidLogin = new RegExp(/^[A-Za-z0-9_]{4,24}$/);
		const isValidName = new RegExp(/^[A-Za-z- ]{1,32}$/);
		const isValidDay = RegExp(/^([1-9]|[12][0-9]|3[01])$/);
		const isValidYear = RegExp(/^(19[0-9][0-9])|(20[0-1][0-8])$/);
		const isValidMonth = RegExp(/^([1-9]|1[0-2])$/);

		const { first_name, last_name, login, birthdate } = this.user;
		const errors = [];


		if (!isValidName.test(first_name)) {
			errors.push({
				fieldName: 'first_name',
				msg: 'Names should be 1-32 characters long and can contain only letters and dashes.'
			});
		}
		if (!isValidName.test(last_name)) {
			errors.push({
				fieldName: 'last_name',
				msg: 'Names should be 1-32 characters long and can contain only letters and dashes.'
			});
		}
		if (!isValidLogin.test(login)) {
			errors.push({
				fieldName: 'login',
				msg: 'Login should be 4-24 symbols long and can contain only letters, numbers or a underline.' 
			});
		} else {
			const avalible = await this.isLoginAvalible();
			if (!avalible) {
				errors.push({
					fieldName: 'login',
					msg: 'This login is already taken.'
				});
			}
		}

		if (!isValidMonth.test(birthdate.month)) {
			errors.push({
				fieldName: 'birthdate',
				msg: "Please, select a valid month"
			});
		} else if (!isValidDay.test(birthdate.day)) {
			errors.push({
				fieldName: 'birthdate',
				msg: "Please, enter a valid day"
			});
		} else if (!isValidYear.test(birthdate.year)) {
			errors.push({
				fieldName: 'birthdate',
				msg: "Please, enter a valid year"
			});
		}

		this.setIsValidating(false);
		return errors;
	}

	validateThirdStep() {
		const { tags, bio } = this.user;
		const errors = [];

		const isValidBio = new RegExp(/^[\x00-\x7F]{0,500}$/);

		if (!isValidBio.test(bio)) {
			errors.push({
				fieldName: 'bio',
				msg: "Bio can contain only ascii characters. Max length is 500 symbols."
			})
		}
		if (tags.length < 3) {
			errors.push({
				fieldName: 'tags',
				msg: "Please, add at least 3 tags."
			});
		}

		return Promise.resolve(errors);
	}

	validateFourthStep() {
		const { file } = this.picture;
		const errors = [];

		if (!file) {
			errors.push({
				fieldName: 'picture',
				msg: "Please select a profile picture"
			});
		}

		return Promise.resolve(errors);
	}
	
	verifyHash(hash) {
		return API.Auth.verify(hash);
	}

	async submitInfo(hash) {
		this.setIsValidating(true);

		const formData = this._infoToFormData();
		const response = await API.User.createProfile(hash, formData);

		this.setIsValidating(false);
		return response;
	}

	@action resetRegistration() {
		this.user = {
			login: '',
			first_name: '',
			last_name: '',
			gender: 'male',
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
	
		this.picture = {
			placeholder: `https://avatars.dicebear.com/v2/identicon/${Math.random() * (100 - 1) + 1}.svg`,
			file: '',
			src: '',
			croppData: null
		};
	
		this.errors = {
			login: '',
			first_name: '',
			last_name: '',
			bio: '',
			tags: '',
			birthdate: '',
			picture: '',
		};

		this.step = 1;
		this.getLocationByIp();
	}

	_infoToFormData() {
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
		
		return formData;
	}

}

export default new RegistrationStore();