const User = require('../models/user');

const regexps = {
	login: new RegExp(/^[A-Za-z0-9_]{4,24}$/),
	email: new RegExp (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
	name: new RegExp(/^[A-Za-z- ]{1,32}$/),
	password: new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/)
}

exports.isValidEmail = email => {
	return regexps.email.test(email);
}

exports.isValidPassword = password => {
	return regexps.password.test(password);
}

exports.registrationValidation = async (req, res, next) => {
	const { email, password, password_confirm } = req.body;
	const findUser = User.findOne({ email });

	const errors = [];

	if (!regexps.email.test(email)) {
		errors.push({
			fieldName:'email',
			msg:'Invalid email.'
		});
	}
	if (!regexps.password.test(password)) {
		errors.push({
			fieldName: 'password',
			msg: 'Password should be 8-24 symbols long, must contain at least one uppercase letter and a number.' 
		});
	}
	if (password !== password_confirm) {
		errors.push({
			fieldName: 'password_confirm',
			msg: 'Passwords does not match.'
		});
	}
	if (await findUser) {
		errors.push({
			fieldName: 'email',
			msg: 'This email is already in use.'
		});
	}

	req.validationErrors = errors;
	next();
};
