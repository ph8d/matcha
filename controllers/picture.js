const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(require('../config/multer')); // Error handling https://github.com/expressjs/multer#error-handling
const requiresLogin = require('../lib/requresLogin');
const User = require('../models/user');

router.use('*', requiresLogin);

router.post('/', upload.single('image'), (req, res) => {
	if (!req.file) {
		return res.status(400).end();
	}

	let newPicture = {
		user_id: req.user.id,
		src: `../images/upload/${req.file.filename}`
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
});

module.exports = router;