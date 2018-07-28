const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');

module.exports = (passport) => {
	passport.use(new LocalStrategy({
		usernameField: 'login'
	},

	(login, password, done) => {
		User.findOne({login:login})
			.then(user => {
				if (!user) {
					done(null, false, {type: 'danger', message: 'Login or password is incorrect.'});
				} else if (!user.is_verified) {
					done(null, false, {type: 'danger', message: 'Your need to confirm your email before logging in. Check your email.'});
				} else {
					bcrypt.compare(password, user.password)
						.then(isMatch => {
							if (isMatch) {
								return done(null, user);
							} else {
								return done(null, false, {type: 'danger', message: 'Login or password is incorrect.'});
							}
						})
						.catch(done);
				}
			})
			.catch(done);
	}));

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});
	  
	passport.deserializeUser(function(id, done) {
		User.findOne({id:id})
			.then(user => {
				done(null, user);
			})
			.catch(error => {
				done(error, false);
			})
	  });
};
