const User = require('../models/user');

exports.index = (req, res) => {
	res.render('home');
};

exports.about = (req, res) => {
	res.render('about');
};

exports.profile = (req, res, next) => {
	let user = req.user;
	delete user.password;
	delete user.verification_hash;
	delete user.is_verified;

	User.findAllInterestsByUserId(user.id)
		.then(interests => {
			console.log(interests);
			res.render('profile', {user:user, interests:interests});
		})
		.catch(console.error);
};