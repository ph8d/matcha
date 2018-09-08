const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(require('../config/multer')); // Error handling https://github.com/expressjs/multer#error-handling
const requiresAuth = require('../lib/requiresAuth');
const Tags = require('../models/tags');

router.use('*', requiresAuth);

router.get('/:id', (req, res) => {
	Tags.findOne({ id: req.params.id })
		.then(tag => {
			if (!tag) {
				res.sendStatus(404);
			}
			res.json(tag);
		})
		.catch(error => {
			console.error(error);
			res.sendStatus(500);
		});
});

router.post('/json', upload.none(), (req, res) => {
	if (req.body.tag) {
		let newTag = {
			user_id: req.user.id,
			value: req.body.tag
		}
		Tags.add(newTag)
			.then(result => {
				newTag.id = result.insertId;
				res.json(newTag);
			})
			.catch(error => {
				console.error(error);
				res.sendStatus(500);
			});
	} else {
		res.sendStatus(400);
	}
});

router.delete('/:id', (req, res) => {
	Tags.delete({ id: req.params.id })
		.then(result => {
			res.sendStatus(200);
		})
		.catch(error => {
			console.error(error);
			res.sendStatus(500);
		});
})

module.exports = router;
