const express = require('express');
const router = express.Router();
const passport = require('passport');
const home = require('../controllers/home');
const account = require('../controllers/account');

// Custom middleware to check if user is logged in and refirect to the homepage if not logged in [unused]
function requiresLogin(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        req.flash('danger', 'You must log in to access that page!');     
        return res.redirect('/');
    }
};

router.get('/', home.index);

router.get('/about', requiresLogin, home.about);

router.all('/register', account.register);

// router.all('/login', account.login);

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: false
    })(req, res, next);
});

module.exports = router;