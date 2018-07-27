const express = require('express');
const router = express.Router();
const home = require('../controllers/home');
const account = require('../controllers/account');

/* Access Control Middleware */

function requiresLogin(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash('danger', 'You must log in to access that page!');
		return res.redirect('/login');
	}
};

router.all('*', (req, res, next) => {
	res.locals.isAuthenticated = (!!req.user);
	next();
});

router.get('/', home.index);

router.get('/about', home.about);

router.all('/register', account.register);

router.get('/login', (req, res) => {
	if (req.isAuthenticated()) {
		req.flash('info', 'You are already logged in.');
		res.redirect('/');
	} else {
		res.render('login');		
	}
});

router.post('/login', account.login);

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;