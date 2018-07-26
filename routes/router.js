const express = require('express');
const router = express.Router();
const home = require('../controllers/home');
const account = require('../controllers/account');

/* Custom middleware to check if user is logged in and refirect to the homepage if not logged in [unused] */

// function requiresLogin(req, res, next) {
//     if (req.session && req.session.userId) {
//         return next();
//     } else {
//         req.flash('danger', 'You must log in to access that page!');     
//         return res.redirect('/');
//     }
// };

router.get('/', home.index);

router.get('/about', home.about);

router.all('/register', account.register);

router.get('/login', (req, res) => {
	res.render('login');
});

router.post('/login', account.login);

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;