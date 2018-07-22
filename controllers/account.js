const User = require('../models/user')

exports.register = (req, res) => {
    // User.logAllUsers(res.locals.db.pool);
    console.log(User.getOneByLoginInformation(['rtarasen', 'ghbdtn123'], res.locals.db.pool));

    let validationError = false;
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

        /* Need to implement validation */

        if (!!validationError) {

            /* Handle the error */

        } else {

            /* Add new user to database */

            delete form.confirm_password;
            User.add(form, res.locals.db.pool);

            /* Need to send an email to verify user account -> https://www.npmjs.com/package/express-mailer */

            req.flash('success', 'Registration successful! Please check your email.')
            return res.redirect('/');
        }
    }

    res.render('register', {form: form});
};

exports.login = (req, res) => {
    let form = {
        login: '',
        password: ''
    };

    if (req.method === 'POST' && req.body.submit === 'OK') {
		form.login = req.body.login;
		form.password = req.body.password;

        let user = User.getOneByLoginInformation(form, res.locals.db.pool);
        if (!!user) {

            /* Implement authentication */

            res.flash('success', 'Registration successful! Please check your email.')
            return res.redirect('/');
        } else {

            /* Handle the error if there is one */

        }
    }
    res.render('login');
};