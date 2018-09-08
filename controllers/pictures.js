const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(require('../config/multer')); // Error handling https://github.com/expressjs/multer#error-handling
const requiresAuth = require('../lib/requiresAuth');
const Picture = require('../models/picture');

router.use('*', requiresAuth);

router.get('/:id', (req, res) => {
	Picture.findOne({ id: req.params.id })
		.then(picture => {
			if (!picture) {
				res.sendStatus(404);
			} else {
				res.json(picture);
			}
		})
		.catch(error => {
			console.error(error);
			res.sendStatus(500);
		})
});

router.post('/', upload.single('image'), (req, res) => {
	if (!req.file) {
		return res.status(400).end();
	}

	let newPicture = {
		user_id: req.user.id,
		src: `../images/upload/${req.file.filename}`
	}

	Picture.add(newPicture)
		.then(result => {
			console.log(`ID of inserted image (${result.insertId})`);
			res.json({ src: newPicture.src });
		})
		.catch(error => {
			console.error(error);
			res.status(500).end();
		})
});

router.delete('/:id', (req, res) => {
	Picture.delete({id: req.body.id})
		.then(result => {
			console.log(result);
			res.sendStatus(200);
		})
		.catch(error => {
			console.error(error);
			res.sendStatus(500);
		});
})

module.exports = router;