const User = require('../models/user');
const passport = require('passport');
const validator = require('../lib/validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

/* I need to review this whole file tomorrow, i feel like this controller is too fat */
/* Maybe i can move some of this code in a model */

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

exports.recovery = (req, res) => {
	let email = '';

	if (req.method === 'POST' && req.body.submit === 'OK') {
		email = req.body.email;
		if (!validator.isValidEmail(email)) {
			req.flash('danger', 'Email is invalid.');
		} else {
			User.findOne({email:email})
				.then(user => {
					if (!user) {
						req.flash('success', 'We have sent instructions on how to reset your password to your email. If letter is not arriving check your spam folder and make sure you entered correct email adress.');
						res.render('recovery', {email:email});
					} else {
						User.genRecoveryRequest(user.id)
							.then(hash => {
								res.mailer.send('./emails/recovery', {
									to: user.email,
									subject: 'Matcha | Password recovery',
									hash: hash,
									user: user,
								}, error => {
									if (error) {
										throw error;
									} else {
										req.flash('success', 'We have sent instructions on how to reset your password to your email. If letter is not arriving check your spam folder and make sure you entered correct email adress.');
										res.render('recovery', {email:email});
									}
								});
							})
							.catch(error => {
								console.error(error);
								req.flash('danger', 'Some server side error occured, please try again.');
								res.render('recovery', {email:email});
							});
					}
				})
				.catch(error => {
					console.error(error);
					req.flash('danger', 'Some server side error occured, please try again.');
					res.render('recovery', {email:email});
				});
		}
	} else {
		res.render('recovery', {email:email});
	}
};

exports.reset = (req, res) => {
	let userId = req.params.id;
	let receivedHash = req.params.hash;

	User.findRecoveryRequest(userId, receivedHash)
		.then(rows => {
			if (rows.length === 0) {
				res.redirect('/');
			} else {
				if (req.method === 'POST' && req.body.submit === 'OK') {
					let password = req.body.password;
					let password_confirm = req.body.password_confirm;

					if (!validator.isValidPassword(password) || password !== password_confirm) {
						req.flash('danger', 'Password should be 8-24 symbols long, must contain at least one uppercase letter and a number.');
						res.render('reset');
					} else {
						bcrypt.hash(password, 12)
							.then(hash => {
								return User.update({id:userId}, {password:hash});
							})
							.then(responce => {
								return User.delAllRecoveryRequestsByUserId(userId);
							})
							.then(result => {
								req.flash('success', 'Your password was successfuly changed, you may log in now.');
								res.redirect('/login');
							})
							.catch(error => {
								console.error(error);
								req.flash('danger', 'Some server side error occured, please try again.');
							});
					}
				} else {
					res.render('reset');
				}
			}
		})
		.catch(error => {
			console.error(error);
			req.flash('danger', 'Some server side error occured, please try again.');
		});
};
