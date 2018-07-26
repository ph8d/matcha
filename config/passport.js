const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'login'
    },

    (login, password, done) => {
        User.getByLogin(login, (error, user) => {
            console.log(user);
            if (error) return done(error);
            if (!user) {
                return done(null, false, {type: 'danger', message: 'Login or password is incorrect.'});
            }
            if (password !== user.password) {
                return done(null, false, {type: 'danger', message: 'Login or password is incorrect.'});
            }
            return done(null, user);

            // bcrypt.compare(password, user.password, (error, isMatch) => {
            //     if (error) throw error;
            //     if (isMatch) {
            //         return done(null, user);
            //     } else {
            //         return done(null, false, {message: 'Login or password is incorrect.'});
            //     };
            // });
        });
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
      
    passport.deserializeUser(function(id, done) {
        User.getById(id, function(err, user) {
          done(err, user);
        });
      });
};