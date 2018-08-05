const User = require('../models/user');

exports.add = (req, res) => {
	let newPicture = {
		user_id: req.user.id,
		src: `images/upload/${req.file.filename}`
	}

	User.addPicture(newPicture)
		.then(insertId => {
			console.log(`ID of inserted image (${insertId})`);
			res.send(newPicture.src);
		})
		.catch(error => {
			console.error(error);
			res.status(500).end();	
		})
};