const User = require('../models/user');
const passport = require('passport');
const registrationValidation = require('../lib/registrationValidation');
const bcrypt = require('bcrypt');

exports.register = (req, res) => {
	let form = {
		login: '',
		email: '',
		first_name: '',
		last_name: '',
	};

	if (req.method === 'POST' && req.body.submit === 'OK') {
		form.login = req.body.login;
		form.email = req.body.email;
		form.first_name = req.body.first_name;
		form.last_name = req.body.last_name;
		form.password = req.body.password;
		form.password_confirm = req.body.password_confirm;

		let validationErrors = registrationValidation(form);

		if (validationErrors.length > 0) {
			validationErrors.forEach(msg => {
				req.flash('danger', msg);
			});
			res.render('register', {form:form});		
		} else {

			/* I need to check if user with this email or login already exist! */

			/* And i think i want to use promises on everything again. */
			/* Mixing promises with callbacks is a really bad idea!!! */

			delete form.password_confirm;

			bcrypt.genSalt(12)
				.then(salt => {
					return bcrypt.hash(form.password, salt);
				})
				.then(hash => {
					form.password = hash;

					/* Need to add new user to database */

					req.flash('success', 'Registration successful! Please, check your email.');
					res.redirect('/');
				})
				.catch(error => {
					console.error(error);
					req.flash('danger', 'Some server side error occured, please try again.');
					res.render('register', {form:form});
				});
		}
	} else {
		res.render('register', {form:form});
	}
};

exports.login = (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	})(req, res, next);
};
