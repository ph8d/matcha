const Interest = require('../models/interest');

exports.add = (req, res) => {
	if (req.body.interest) {
		let newInterest = {
			user_id: req.user.id,
			value: req.body.interest
		}
		Interest.add(newInterest)
			.then(insertId => {
				res.send(
					`<span class="badge badge-primary m-1">
						<span class="interest-value">${newInterest.value}</span>
						<span id="remove-interest"> ×</span>
					</span>`
				);
			})
			.catch(error => {
				console.error(error);
				res.status(500).end();
			});
	} else {
		res.status(400).end();
	}
};

exports.delete = (req, res) => {
	if (req.body.interest) {
		let interest = {
			user_id: req.user.id,
			value: req.body.interest
		}
		Interest.delete(interest)
			.then(result => {
				res.status(200).end();
			})
			.catch(error => {
				console.error(error);
				res.status(500).end();
			});
	} else {
		res.status(400).end();
	}
};

exports.get = (req, res) => {
	Interest.findAll({user_id:req.user.id})
		.then(interests => {
			res.json({interests:interests});
		})
		.catch(error => {
			console.error(error);
			res.status(500).end();
		});
};