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
                    done(null, false, {message: 'Login or password is incorrect.'});
                }
                if (password === user.password) {
                    return done(null, user);
                } else {
                    return done(null, false, 'Login or password is incorrect.');
                }
                // bcrypt.compare(password, user[0].password, (error, isMatch) => {
                //     if (error) throw error;
                //     if (isMatch) {
                //         return done(null, user[0]);
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