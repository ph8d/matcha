const User = require('../models/user')

exports.register = (req, res) => {
    User.logAllUsers(res.locals.db.pool);

    let validationError = false;
    let form = {}
    form.login = '';
    form.email = '';
    form.first_name = '';
    form.last_name = '';
    form.password = '';
    form.confirm_password = '';

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
        }
    }

    res.render('register', {form: form});
};

exports.login = (req, res) => {
    res.render('login');
};