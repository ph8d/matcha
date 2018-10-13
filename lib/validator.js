var User = require('../models/user');

var regexps = {
	login: new RegExp(/^[A-Za-z0-9_]{4,24}$/),
	email: new RegExp (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
	name: new RegExp(/^[A-Za-z- ]{1,32}$/),
	password: new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/)
}

exports.registrationValidation = async (userData) => {
	let errors = {};

	if (!regexps.email.test(userData.email)) {
		errors.email = 'Invalid email.';
	}
	if (!regexps.password.test(userData.password)) {
		errors.password = 'Password should be 8-24 symbols long, must contain at least one uppercase letter and a number.';
	}
	if (userData.password !== userData.password_confirm) {
		errors.password_confirm = 'Passwords does not match.';
	}

	const user = await User.findOne({ email: userData.email })
	if (user) {
		errors.email = 'This email is already in use.';
	}

	return (errors);
};

exports.isValidEmail = email => {
	return regexps.email.test(email);
}

exports.isValidPassword = password => {
	return regexps.password.test(password);
}