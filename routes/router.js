const express = require('express');
const router = express.Router();
const home = require('../controllers/home');
const account = require('../controllers/account');
const interest = require('../controllers/interest');

function requiresLogin(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash('danger', 'You must log in to access that page!');
		return res.status(401).redirect('/login');
	}
};

router.all('*', (req, res, next) => {
	// Creating a variable that contains true if user is authenticated, otherwise it is false
	res.locals.isAuthenticated = (!!req.user);
	next();
});

router.get('/', home.index);

router.get('/about', home.about);

router.all('/register', account.register);

router.get('/verify/:hash', account.verify);

router.get('/login', (req, res) => {
	if (req.isAuthenticated()) {
		req.flash('info', 'You are already logged in.');
		res.redirect('/');
	} else {
		res.render('login');		
	}
});

router.all('/reset/:hash', account.reset);

router.all('/recovery', account.recovery);

router.post('/login', account.login);

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

router.all('/profile', requiresLogin, home.profile);

router.post('/interest/add', requiresLogin, interest.add);
router.post('/interest/delete', requiresLogin, interest.delete);

module.exports = router;