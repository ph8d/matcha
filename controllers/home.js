const User = require('../models/user');
const Interest = require('../models/interest');

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

	let interests = [];
	let pictures = [];

	Interest.findAll({user_id:user.id})
		.then(result => {
			interests = result;
			return User.getAllPicturesByUserId(user.id);
		})
		.then(result => {
			pictures = result;
			res.render('profile',{
				user:user,
				interests:interests,
				pictures:pictures
			});
		})
		.catch(console.error);
};