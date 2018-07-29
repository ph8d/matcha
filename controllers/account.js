const User = require('../models/user');
const passport = require('passport');
const validator = require('../lib/validator');
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

		/* Validation works but it looks scary, probably requires some refactoring */

		validator.registrationValidation(form)
			.then(validationErrors => {
				if (validationErrors.length > 0) {
					validationErrors.forEach(msg => {
						req.flash('danger', msg);
					});
					res.render('register', {form:form});		
				} else {
					delete form.password_confirm;
					bcrypt.hash(form.password, 12)
						.then(hash => {
							form.password = hash;
							return User.add(form);
						})
						.then(insertedId => {
							console.log('ID of inserted user: ' + insertedId)
							req.flash('success', 'Registration successful! Please, check your email.');
							res.redirect('/');
						})
						.catch(reason => {
							console.error(error);
							req.flash('danger', 'Some server side error occured. Please try again.');
							res.render('register', {form:form});
						});
				}
			})
			.catch(error => {
				console.error(error);
				req.flash('danger', 'Some server side error occured. Please try again.');
				res.render('register', {form:form});
			});
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
