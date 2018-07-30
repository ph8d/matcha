const User = require('../models/user');
const passport = require('passport');
const validator = require('../lib/validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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

		/* Validation works but it looks scary, probably requires refactoring */

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
							form.verification_hash = crypto.randomBytes(20).toString('hex');
							return User.add(form);
						})
						.then(insertedId => {
							res.mailer.send('./emails/verification', {
								to: form.email,
								subject: 'Matcha | Verification',
								userId: insertedId,
								user: form,
							}, error => {
								// If error occures on this step of registration i need to do something like deleting user form database
								// So he can register with his email and username again
								if (error) console.error(error);
								req.flash('success', 'Registration successful! Please, check your email.');
								res.redirect('/');
							});
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

exports.verify = (req, res) => {
	User.findOne({id:req.params.id})
		.then(user => {
			if (user && !user.is_verified && req.params.hash === user.verification_hash) {
				User.update({id:req.params.id}, {is_verified:1})
					.then(result => {
						req.flash('success', 'Your email is now verified, you may login in.')
						res.redirect('/login');
					})
					.catch(error => {
						console.error(error);
						req.flash('danger', 'Some server side error occured, please try again.')
						res.redirect('/');
					})
			} else {
				res.redirect('/');
			}
		})
		.catch(console.error);
};

exports.login = (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	})(req, res, next);
};
