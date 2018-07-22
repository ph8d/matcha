const express = require('express');
const router = express.Router();
const home = require('../controllers/home');
const account = require('../controllers/account');

// Middleware to check if user is logged in and if user is not logged in redirect to a homepage
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

router.all('/login', account.login);

module.exports = router;