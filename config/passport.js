const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'login'
    },
    (login, password, done) => {
        User.getOneByLogin(login)
            .then(user => {
                if (!user) {
                    return done(null, false, {message: 'Login or password is incorrect.'});
                }

                /* Code below used only for debugging, i need to replace it with commented out code */

                if (password === user.password) {
                    return done(null, user);
                } else {
                    return done(null, false, 'Login or password is incorrect.');
                }
                // bcrypt.compare(password, user.password, (error, isMatch) => {
                //     if (error) throw error;
                //     if (isMatch) {
                //         return done(null, user);
                //     } else {
                //         return done(null, false, {message: 'Login or password is incorrect.'});
                //     };
                // });
            }, reason => {
                return done(reason);
            })
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
      
    passport.deserializeUser(function(id, done) {
        User.getById(id)
            .then(user => {
                done(null, user);
            }, reason => {
                done(reason, null);
            });
    });
};