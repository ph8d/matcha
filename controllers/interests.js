const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(require('../config/multer')); // Error handling https://github.com/expressjs/multer#error-handling
const requiresLogin = require('../lib/requresLogin');
const Interests = require('../models/interests');

router.use('*', requiresLogin);

router.post('/html', upload.none(), (req, res) => {
	if (req.body.interest) {
		let newInterest = {
			user_id: req.user.id,
			value: req.body.interest
		}
		Interests.add(newInterest)
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
});

router.delete('/', (req, res) => {
	if (req.body.interest) {
		let interest = {
			user_id: req.user.id,
			value: req.body.interest
		}
		Interests.delete(interest)
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
});

router.get('/json', (req, res) => {
	Interests.findAll({user_id:req.user.id})
		.then(interests => {
			res.json({interests:interests});
		})
		.catch(error => {
			console.error(error);
			res.status(500).end();
		});
});

router.get('/:userId', (req, res) => {
	Interests.findAll({user_id:req.user.userId})
		.then(interests => {
			res.json({interests:interests});
		})
		.catch(error => {
			console.error(error);
			res.status(500).end();
		});
});

module.exports = router;
