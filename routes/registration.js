var express = require('express');
var router = express.Router();
var userModel = require('../models/userModel');

router.all('/', (req, res, next) => {
	res.locals.validationErrors = false;
	let formData = {
		login: '',
		email: '',
		first_name: '',
		last_name: '',
		password: '',
		confirm_password: '',
	}

	if (req.method === 'POST' && req.body.submit === 'OK') {
		formData.login = req.body.login;
		formData.email = req.body.email;
		formData.first_name = req.body.first_name;
		formData.last_name = req.body.last_name;
		formData.password = req.body.password;
        formData.confirm_password = req.body.confirm_password;
        
		/*
			Form validation here...
		*/

		if (!!errors) {
            errors.forEach(msg => {
                req.flash('danger', msg);
			});
			res.locals.validation
		} else {
			let newUser = {};
			Object.keys(formData).forEach(key => {
				if (key !== 'confirm_password') {
					newUser[key] = formData[key];					
				}
			});
            db.addUser(newUser);
			req.flash('success', 'Registration successful! Please, check your email.');
			res.redirect('/');
			return;
		}
	}
	next();
	res.render('register', {
		title: 'Register',
		form: formData
	});
});

module.exports = router;