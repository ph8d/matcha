const express = require('express');
const router = express.Router();
const passport = require('passport');
const validator = require('../lib/validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const upload = multer(require('../config/multer'));
const requiresAuth = require('../lib/requiresAuth');

const User = require('../models/user');
const Interests = require('../models/interests');
const Picture = require('../models/picture');

router.post('/register', upload.none(), (req, res) => {
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
						res.json({ message: "Please, check your email. We've sent you the link to verify your account." });
					});
				})
				.catch(error => {
					console.error(error);
					res.sendStatus(500);
				});
		})
		.catch(error => {
			console.error(error);
			res.sendStatus(500);
		});
});

router.post('/login', (req, res, next) => {
	User.findOne({ email: req.body.email })
		.then(user => {
			if (!user || user.is_verified === 0) {
				return res.sendStatus(401);
			}
			bcrypt.compare(req.body.password, user.password)
				.then(isMatch => {
					if (!isMatch) return res.sendStatus(401);
					jwt.sign({
						userId: user.id,
						login: user.login
					}, 'SECRET_KEY_THAT_I_NEED_TO_REPLACE_LATER', {
						expiresIn: '1h'
					}, (error, token) => {
						if (error) throw error;
						res.json({ token });
					});
				})
				.catch(error => {
					throw error;
				});
		})
		.catch(error => {
			console.error(error);
			res.sendStatus(401);
		});
});

router.post('/verify', (req, res) => {
	let isHex = new RegExp(/^[0-9a-f]*$/i);
	if (!isHex.test(req.body.hash)) return res.sendStatus(401);
	User.findOne({ verification_hash: req.body.hash })
		.then(user => {
			if (!user || user.is_verified) {
				return res.sendStatus(401);
			}
			User.update({id:user.id}, { is_verified: 1 })
				.then(result => {
					res.json({ message: "Your account is now verified, you may log in." });
				})
				.catch(error => {
					console.error(error);
					res.sendStatus(500);
				})
		})
		.catch(console.error);
});

router.get('/reset', (req, res) => {

});

router.post('/reset', (req, res) => {
	let receivedHash = req.body.hash;
	let password = req.body.password;

	let isHex = new RegExp(/^[0-9a-f]*$/i);

	if (!isHex.test(receivedHash) || !password) return res.sendStatus(401);
	User.findRecoveryRequest(receivedHash)
		.then(recoveryRequest => {
			if (!recoveryRequest) return res.sendStatus(401);
			if (!validator.isValidPassword(password)) {
				return res.status(202).json({ password: 'Password should be 8-24 symbols long, must contain at least one uppercase letter and a number.' });
			}
			bcrypt.hash(password, 12)
				.then(hashedPassword => {
					return User.update({ id:recoveryRequest.user_id }, { password:hashedPassword });
				})
				.then(responce => {
					return User.delAllRecoveryRequestsByUserId(recoveryRequest.user_id);
				})
				.then(result => {
					res.json({ message: 'Your password was successfuly changed, you may log in now.' });
				})
				.catch(error => {
					console.error(error);
					res.sendStatus(500);
				});
		})
		.catch(error => {
			console.error(error);
			res.sendStatus(500);
		});
});


router.post('/recovery', (req, res) => {
	email = req.body.email;
	if (!validator.isValidEmail(email)) {
		return res.status(202).json({ email: 'Email is invalid.' });
	}
	User.findOne({ email })
		.then(user => {
			if (!user) {
				return res.json({ message: "We have sent instructions on how to reset your password to your email. If letter is not arriving check your spam folder and make sure you entered correct email adress." });
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
						return res.json({ message: "We have sent instructions on how to reset your password to your email. If letter is not arriving check your spam folder and make sure you entered correct email adress." });
					});
				})
				.catch(error => {
					console.error(error);
					// req.flash('danger', 'Some server side error occured, please try again.');
					res.sendStatus(500);
				});
		})
		.catch(error => {
			console.error(error);
			// req.flash('danger', 'Some server side error occured, please try again.');
			res.sendStatus(500);
		});
});

router.all('*', requiresAuth); // From this point all routes will require authentication

router.get('/', (req, res) => {
	User.getAll()
		.then(users => res.json(users))
		.catch(error => {
			console.error(error);
			res.status(500).end();
	});
});

router.get('/:id/pictures', (req, res) => {
	Picture.findAll({ user_id: req.params.id })
		.then(pictures => {
			if (!pictures) {
				res.sendStatus(404);
			} else {
				res.json(pictures);
			}
		})
		.catch(error => {
			console.error(error);
			res.sendStatus(500);
		})
});

router.get('/:id/interests', (req, res) => {
	Interests.findAll({ user_id: req.params.id })
		.then(interests => {
			if (interests.length < 1) {
				res.sendStatus(404);
			} else {
				res.json(interests);
			}
		})
		.catch(error => {
			console.error(error);
			res.sendStatus(500);
		});
});

router.get('/:id', (req, res) => {
	User.findOne({ id: req.params.id })
		.then(user => {
			if (!user) {
				res.sendStatus(404)
			} else {
				res.json(user);				
			}
		})
		.catch(error => {
			console.error(error);
			res.status(500).end();
	});
});

module.exports = router;
