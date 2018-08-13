const express = require('express');
const router = express.Router();
const passport = require('passport');
const validator = require('../lib/validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const multer = require('multer');
const upload = multer(require('../config/multer'));
const requiresLogin = require('../lib/requresLogin');
const User = require('../models/user');
const Interests = require('../models/interests');
const Picture = require('../models/picture');


router.get('/', (req, res) => {
	User.getAll()
		.then(users => res.json(users))
		.catch(error => {
			console.error(error);
			res.status(500).end();
	});
})

router.get('/register', (req, res) => {
	res.render('register');
});

router.post('/', upload.none(), (req, res) => {
	console.log('REGISTER ROUTE!');
	let form = {
		login: req.body.login, // This needs to be converted to lowercase
		email: req.body.email, // And this too
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		password: req.body.password,
		password_confirm: req.body.password_confirm
	};

	validator.registrationValidation(form)
		.then(errors => {
			if (Object.keys(errors).length > 0 && errors.constructor === Object) {
				return res.status(202).json(errors);
			}
			delete form.password_confirm;
			bcrypt.hash(form.password, 12)
				.then(hash => {
					form.password = hash;
					form.verification_hash = crypto.randomBytes(20).toString('hex');
					return User.add(form);
				})
				.then(result => {
					console.log('Inserted user ID: ', result.insertId);
					res.mailer.send('./emails/verification', {
						to: form.email,
						subject: 'Matcha | Verification',
						user: form
					}, error => {

						// If error occures on this step of registration i need to do something like deleting user form database
						// So he can register with his email and username again

						if (error) throw error;
						req.flash('success', 'Registration successful! Please, check your email.');
						res.status(200).end();
					});
				})
				.catch(error => {
					console.error(error);
					res.status(500).end();
				});
		})
		.catch(error => {
			console.error(error);
			res.status(500).end();
		});
});

router.get('/login', (req, res) => {
	if (req.isAuthenticated()) {
		req.flash('info', 'You are already logged in.');
		res.redirect('/');
	} else {
		res.render('login');
	}
});

router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/users/login',
		failureFlash: true
	})(req, res, next);
});

router.all('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

router.get('/verify/:hash', (req, res) => {
	User.findOne({verification_hash:req.params.hash})
		.then(user => {
			if (!user || user.is_verified) {
				return res.redirect('/');
			}
			User.update({id:user.id}, {is_verified:1})
				.then(result => {
					req.flash('success', 'Your email is now verified, you may login in.')
					res.redirect('/users/login');
				})
				.catch(error => {
					console.error(error);
					req.flash('danger', 'Some server side error occured, please try again.')
					res.redirect('/');
				})
		})
		.catch(console.error);
});

/* This route can be split up in two smaller ones */
router.all('/reset/:hash', (req, res) => {
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
						res.redirect('/users/login');
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
});

/* This route can be split up in two smaller ones */
router.all('/recovery', (req, res) => {
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
});

router.all('*', requiresLogin); // From this point all routes will require authentication

/* this route is not cool */
router.get('/profile', (req, res) => {
	let user = req.user;
	delete user.password;
	delete user.verification_hash;
	delete user.is_verified;

	let interests = [];
	let pictures = [];

	Interests.findAll({user_id:user.id})
		.then(result => {
			interests = result;
			return Picture.findAllByUserId(user.id);
		})
		.then(result => {
			pictures = result;
			res.render('profile',{
				user:user,
				interests:interests,
				pictures:pictures
			});
		})
		.catch(console.error);
});

module.exports = router;