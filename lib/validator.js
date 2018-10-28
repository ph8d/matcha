const bcrypt = require('bcrypt');
const User = require('../models/user');

const regexps = {
	login: new RegExp(/^[A-Za-z0-9_]{4,24}$/),
	email: new RegExp (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
	name: new RegExp(/^[A-Za-z- ]{1,32}$/),
	password: new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/),
	bio: new RegExp(/^[\x00-\x7F]{0,500}$/),
	birthdate: new RegExp(/^((19[0-9][0-9])|(20[0-1][0-8]))-(0[1-9]|1[0-2])-([012][0-9]|3[01])$/)
}

const _genders = ['male', 'female'];
const _preferences = ['male', 'female', '*'];

const _profileValidationSchema = {
	'login': { type: 'string', pattern: regexps.login },
	'first_name': { type: 'string', pattern: regexps.name },
	'last_name': { type: 'string', pattern: regexps.name },
	'gender': { type: 'string', oneOf: _genders },
	'searching_for': { type: 'string', oneOf: _preferences },
	'birthdate': { type: 'string', pattern: regexps.birthdate },
	'lat': { type: 'number' },
	'lng': { type: 'number' }
}

const _isValidType = (fieldName, fieldValue) => {
	const { type } = _profileValidationSchema[fieldName];
	return (!type || typeof fieldValue === type);
}

const _isAllowedValue = (fieldName, fieldValue) => {
	const { oneOf } = _profileValidationSchema[fieldName];
	return (!oneOf || oneOf.includes(fieldValue));
}

const _isValidPattern = (fieldName, fieldValue) => {
	const { pattern } = _profileValidationSchema[fieldName];
	return (!pattern || pattern.test(fieldValue));
}

const _validateProfileFieldsWithSchema = (profile, fields) => {
	const invalidFields = [];

	Object.keys(_profileValidationSchema).forEach(field => {
		if (!profile[field]) {
			invalidFields.push([{ fieldName: field, msg: "This field is required" }]);
		} else {
			const { type, pattern, oneOf } = _profileValidationSchema[field];
			const fieldValue = profile[field];

			if (typeof fieldValue !== type) {
				invalidFields.push({ fieldName: field, msg: 'Invalid data type.' });
			}
			if ((pattern && !pattern.test(fieldValue))) {
				invalidFields.push({ fieldName: field, msg: 'Invalid data format.' });
			}
			if ((oneOf && !oneOf.includes(fieldValue))) {
				invalidFields.push({ fieldName: field, msg: 'Invalid value.' });
			}
		}
	});

	return invalidFields;
}



exports.isValidEmail = email => {
	return regexps.email.test(email);
}

exports.isValidPassword = password => {
	return regexps.password.test(password);
}

exports.profileCreationValidation = async (req, res, next) => {
	let { profile, tags, croppData } = req.body;
	req.validationErrors = [];

	if (!profile) {
		req.validationErrors.push({
			fieldName: 'profile',
			msg: 'Profile data is required.'
		});
	} else {
		try {
			const parsedProfile = JSON.parse(profile);
			const invalidFields = _validateProfileFieldsWithSchema(parsedProfile);
			if (invalidFields.length > 0) {
				req.validationErrors.push({
					fieldName: 'profile',
					msg: 'Profile has invalid fields.',
					invalidFields
				});
			}
		} catch (e) {
			if (e instanceof SyntaxError) {
				req.validationErrors.push({
					fieldName: 'profile',
					msg: 'Profile parsing error, invalid format.'
				});
			} else {
				req.validationErrors.push({
					fieldName: 'profile',
					msg: 'Error occured while processing profile data.'
				});
				console.error(e);
			}
		}
	}

	if (!tags) {
		req.validationErrors.push({
			fieldName: 'tags',
			msg: 'Tags are required.'
		});
	}

	if (!req.file) {
		req.validationErrors.push({
			fieldName: 'picture',
			msg: 'Profile picture is either missing or invalid.'
		});
	}

	if (!croppData) {
		req.validationErrors.push({
			fieldName: 'coppData',
			msg: 'Cropping info is required.'
		});
	}

	next();
}

exports.checkProfileField = (fieldName, isRequired = false) => {
	const middleware = (req, res, next) => {
		req.validationErrors = (req.validationErrors || []);
		
		if (!req.body.profile) return next();

		const fieldValue = req.body.profile[fieldName];
		if (!fieldValue && !isRequired) {
			return next();
		}

		if (!_isValidType(fieldName, fieldValue)) {
			req.validationErrors.push({ fieldName, msg: 'Invalid data type.' });
		}
		if (!_isValidPattern(fieldName, fieldValue)) {
			req.validationErrors.push({ fieldName, msg: 'Invalid data format.' });
		}
		if (!_isAllowedValue(fieldName, fieldValue)) {
			req.validationErrors.push({ fieldName, msg: 'Invalid value.' });
		}
		next();
	}

	return middleware;
}

exports.registrationValidation = async (req, res, next) => {
	const { email, password, password_confirm } = req.body;
	const findUser = User.findOne({ email });

	const errors = [];

	if (!regexps.email.test(email)) {
		errors.push({
			fieldName: 'email',
			msg: 'Invalid email.'
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

exports.emailValidation = async (req, res, next) => {
	const { email } = req.body;

	req.validationErrors = [];

	if (!regexps.email.test(email)) {
		req.validationErrors.push({
			fieldName: 'email',
			msg: 'Invalid email.'
		});
	} else {
		const user = await User.findOne({ email });
		if (user) {
			req.validationErrors.push({
				fieldName: 'email',
				msg: 'This email is already in use.'
			});
		}
	}

	return next();
}

exports.passwordValidation = async (req, res, next) => {
	const { currentPassword, newPassword, confirm } = req.body;

	req.validationErrors = [];
	
	const user = await User.findOne({ id: req.user.id });
	const isCorrectPassword = await bcrypt.compare(currentPassword, user.password);

	if (!isCorrectPassword) {
		req.validationErrors.push({
			fieldName: 'currentPassword',
			msg: 'Password is incorrect.'
		});
	}
	if (!regexps.password.test(newPassword)) {
		req.validationErrors.push({
			fieldName: 'newPassword',
			msg: 'Password should be 8-24 symbols long, must contain at least one uppercase letter and a number.' 
		});
	}
	if (newPassword !== confirm) {
		req.validationErrors.push({
			fieldName: 'confirm',
			msg: "Passwords doesn't match." 
		});
	}

	next();
}
