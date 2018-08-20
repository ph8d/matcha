const express = require('express');
const router = express.Router();
const requiresAuth = require('../lib/requiresAuth');
const User = require('../models/user');

router.use('*', requiresAuth);

router.get('/', (req, res) => {
	User.findOne(req.user.id)
		.then(user => {
			if (user) {
				res.json(user);
			} else {
				res.sendStatus(404);
			}
		})
		.catch(console.error);
});

module.exports = router;
