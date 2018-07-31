var User = require('../models/user');

var regexps = {
	login: new RegExp(/^[A-Za-z0-9_]{4,24}$/),
	email: new RegExp (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
	name: new RegExp(/^[A-Za-z- ]{1,32}$/),
	password: new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/)
}

exports.registrationValidation = userData => {
	return new Promise((resolve, reject) => {
		let errors = [];
	
		if (!regexps.login.test(userData.login)) {
			errors.push('Login should be 4-24 symbols long and can contain only letters, numbers or a underline.');
		}
	
		if (!regexps.email.test(userData.email)) {
			errors.push('Invalid email.');
		}
	
		if (!regexps.name.test(userData.first_name) || !regexps.name.test(userData.last_name)) {
			errors.push('First and last name should be 1-32 characters long and can contain only letters and dashes.');
		}
	
		if (!regexps.password.test(userData.password)) {
			errors.push('Password should be 8-24 symbols long, must contain at least one uppercase letter and a number.');
		}
	
		if (userData.password !== userData.password_confirm) {
			errors.push('Passwords does not match.');
		}

		User.findOne({login:userData.login})
			.then(user => {
				if (user) {
					errors.push('This login is already in use.');
				}
				return User.findOne({email:userData.email});
			})
			.then(user => {
				if (user) {
					errors.push('This email is already in use.');
				}
				resolve(errors);
			})
			.catch(reject);
	});
};

exports.isValidEmail = email => {
	return regexps.email.test(email);
}

exports.isValidPassword = password => {
	return regexps.password.test(password);
}