const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(require('../config/multer')); // Error handling https://github.com/expressjs/multer#error-handling
const requiresAuth = require('../lib/requiresAuth');
const Interests = require('../models/interests');

router.use('*', requiresAuth);

router.get('/:id', (req, res) => {
	Interests.findOne({ id: req.params.id })
		.then(interest => {
			if (!interest) {
				res.sendStatus(404);
			}
			res.json(interest);
		})
		.catch(error => {
			console.error(error);
			res.sendStatus(500);
		});
});

router.post('/html', upload.none(), (req, res) => {
	if (req.body.interest) {
		let newInterest = {
			user_id: req.user.id,
			value: req.body.interest
		}
		Interests.add(newInterest)
			.then(result => {
				res.send(
					`<span class="badge badge-primary m-1">
						<span class="interest-value">${newInterest.value}</span>
						<span id="remove-interest"> ×</span>
					</span>`
				);
			})
			.catch(error => {
				console.error(error);
				res.sendStatus(500);
			});
	} else {
		res.sendStatus(400);
	}
});

router.post('/json', upload.none(), (req, res) => {
	if (req.body.interest) {
		let newInterest = {
			user_id: req.user.id,
			value: req.body.interest
		}
		Interests.add(newInterest)
			.then(result => {
				newInterest.id = result.insertId;
				res.json(newInterest);
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
	Interests.delete({ id: req.params.id })
		.then(result => {
			res.sendStatus(200);
		})
		.catch(error => {
			console.error(error);
			res.sendStatus(500);
		});
})

module.exports = router;
