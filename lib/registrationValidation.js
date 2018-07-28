var User = require('../models/user');

/* Module for validation */

exports.formValidation = userData => {
	let errors = [];
	let isValidLogin = new RegExp(/^[A-Za-z0-9_]{4,24}$/);
	let isValidEmail = new RegExp (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
	let isValidName = new RegExp(/^[A-Za-z- ]{1,32}$/);
	let isValidPassword = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/);

	if (!isValidLogin.test(userData.login)) {
		errors.push('Login should be 4-24 symbols long and can contain only letters, numbers or a underline.');
	}

	if (!isValidEmail.test(userData.email)) {
		errors.push('Invalid email.');
	}

	if (!isValidName.test(userData.first_name) || !isValidName.test(userData.last_name)) {
		errors.push('First and last name should be 1-32 characters long and can contain only letters and dashes.');
	}

	if (!isValidPassword.test(userData.password)) {
		errors.push('Password should be 8-24 symbols long, must contain at least one uppercase letter and a number.');
	}

	if (userData.password !== userData.password_confirm) {
		errors.push('Passwords does not match.');
	}

	return errors;
};

exports.isUniqueCredentials = (login, email) => {

	/* Need to come up with something better than this */

	// return new Promise((resolve, reject) => {
	// 	let errors = [];
	// 	User.findOne({login:login})
	// 		.then(user => {
	// 			if (user) {
	// 				errors.push('This login is already in use.');
	// 			}
	// 			return User.findOne({email:email});
	// 		})
	// 		.then(user => {
	// 			if (user) {
	// 				errors.push('This email is already in use.');
	// 			}
	// 			resolve(errors);
	// 		})
	// 		.catch(reject);
	// });
}