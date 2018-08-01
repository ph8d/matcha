const User = require('../models/user');

exports.index = (req, res) => {
	res.render('home');
};

exports.about = (req, res) => {
	res.render('about');
};

exports.profile = (req, res) => {
	let user = req.user;
	delete user.password;
	delete user.verification_hash;
	delete user.is_verified;
	res.send(user);
};