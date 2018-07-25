const User = require('../models/user');
const passport = require('passport');
const validator = require('../lib/simple-validator/my_validator');

exports.register = (req, res) => {
    let validationErrors = [];
    let form = {
        login: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        confirm_password: ''
    };

    if (req.method === 'POST' && req.body.submit === 'OK') {
		form.login = req.body.login;
		form.email = req.body.email;
		form.first_name = req.body.first_name;
		form.last_name = req.body.last_name;
		form.password = req.body.password;
        form.confirm_password = req.body.confirm_password;

        if (!validator.isLength(form.login, {min: 4, max: 24})) {
            validationErrors.push('Invalid login');
        }

        // Email should be converted to lowercase to avoid creating accounts with similar emails Mark@gmail.com mark@gmail.com!

        if (!validator.isEmail(form.email)) {
            validationErrors.push('Invalid email');
        }

        /* Need to implement validation */

        if (validationErrors.length > 0) {
            req.flash('danger', validationErrors[0]);
        } else {

            /* Add new user to database */

            delete form.confirm_password;
            User.add(form);

            /* Need to send an email to verify user account -> https://www.npmjs.com/package/express-mailer */

            req.flash('success', 'Registration successful! Please check your email.')
            return res.redirect('/');
        }
    }

    res.render('register', {form: form});
};

exports.login = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
};

/* Right now i'm using passport instead of this */

// exports.login = (req, res) => {
//     let form = {
//         login: '',
//         password: ''
//     };

//     if (req.method === 'POST' && req.body.submit === 'OK') {
// 		form.login = req.body.login;
// 		form.password = req.body.password;

//         /* Still need to implement login/password validation */

//         User.getOneByLoginInformation([form.login, form.password])
//             .then(user => {
//                 User.authenticate(user);
//                 res.redirect('/');
//             }, reason => {
//                 req.flash('danger', reason);
//                 res.render('login', {form: form});
//             })
//             .catch(console.error);
//     } else {
//         res.render('login', {form: form});         
//     }
// };