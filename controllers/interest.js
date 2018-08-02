const Interest = require('../models/interest');

exports.add = (req, res) => {
	if (req.body.interest) {
		let newInterest = {
			user_id: req.user.id,
			value: req.body.interest
		}
		Interest.add(newInterest)
		.then(insertId => {
			res.status(200);
		})
		.catch(error => {
			console.error(error);
			res.status(404);
		});
	}
	res.status(400);
};

exports.delete = (req, res) => {
	res.send({status:'pretty cool'});
};