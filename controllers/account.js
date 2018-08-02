const User = require('../models/user');
const passport = require('passport');
const validator = require('../lib/validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

/* I need to review this whole file, i feel like this controller is too fat */
/* Maybe i can move some of this code into the model */

exports.register = (req, res) => {
	let form = {
		login: '',
		email: '',
		first_name: '',
		last_name: '',
	};

	if (req.method === 'POST' && req.body.submit === 'OK') {
		form.login = req.body.login; // This needs to be converted to lowercase
		form.email = req.body.email; // And this too
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
					return res.render('register', {form:form});		
				}
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
							user: form
						}, error => {

							// If error occures on this step of registration i need to do something like deleting user form database
							// So he can register with his email and username again

							if (error) console.error(error);
							req.flash('success', 'Registration successful! Please, check your email.');
							res.redirect('/');
						});
					})
					.catch(error => {
						console.error(error);
						req.flash('danger', 'Some server side error occured. Please try again.');
						res.render('register', {form:form});
					});
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
	User.findOne({verification_hash:req.params.hash})
		.then(user => {
			if (!user || user.is_verified) {
				return res.redirect('/');
			}
			User.update({id:user.id}, {is_verified:1})
				.then(result => {
					req.flash('success', 'Your email is now verified, you may login in.')
					res.redirect('/login');
				})
				.catch(error => {
					console.error(error);
					req.flash('danger', 'Some server side error occured, please try again.')
					res.redirect('/');
				})
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
			return res.render('recovery', {email:email});
		}
		User.findOne({email:email})
			.then(user => {
				if (!user) {
					req.flash('success', 'We have sent instructions on how to reset your password to your email. If letter is not arriving check your spam folder and make sure you entered correct email adress.');
					return res.render('recovery', {email:email});
				}
				User.delAllRecoveryRequestsByUserId(user.id)
					.then(result => {
						return User.genRecoveryRequest(user.id);
					})
					.then(hash => {
						res.mailer.send('./emails/recovery', {
							to: user.email,
							subject: 'Matcha | Password recovery',
							user: user,
							hash: hash
						}, error => {
							if (error) throw error;
							req.flash('success', 'We have sent instructions on how to reset your password to your email. If letter is not arriving check your spam folder and make sure you entered correct email adress.');
							res.render('recovery', {email:email});
						});
					})
					.catch(error => {
						console.error(error);
						req.flash('danger', 'Some server side error occured, please try again.');
						res.render('recovery', {email:email});
					});
			})
			.catch(error => {
				console.error(error);
				req.flash('danger', 'Some server side error occured, please try again.');
				res.render('recovery', {email:email});
			});
	} else {
		return res.render('recovery', {email:email});
	}
};

exports.reset = (req, res) => {
	let receivedHash = req.params.hash;
	User.findRecoveryRequest(receivedHash)
		.then(recoveryRequest => {
			if (!recoveryRequest) {
				return res.redirect('/');
			}
			if (req.method === 'POST' && req.body.submit === 'OK') {
				let password = req.body.password;
				let password_confirm = req.body.password_confirm;

				if (!validator.isValidPassword(password)) {
					req.flash('danger', 'Password should be 8-24 symbols long, must contain at least one uppercase letter and a number.');
					return res.render('reset');
				}
				if (password !== password_confirm) {
					req.flash('danger', 'Passwords does not match.');
					return res.render('reset');
				}
				bcrypt.hash(password, 12)
					.then(hash => {
						return User.update({id:recoveryRequest.user_id}, {password:hash});
					})
					.then(responce => {
						return User.delAllRecoveryRequestsByUserId(recoveryRequest.user_id);
					})
					.then(result => {
						req.flash('success', 'Your password was successfuly changed, you may log in now.');
						res.redirect('/login');
					})
					.catch(error => {
						console.error(error);
						req.flash('danger', 'Some server side error occured, please try again.');
						res.render('reset');
					});
			} else {
				res.render('reset');
			}
		})
		.catch(error => {
			console.error(error);
			req.flash('danger', 'Some server side error occured, please try again.');
			res.render('reset');			
		});
};
