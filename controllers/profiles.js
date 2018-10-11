const express = require('express');
const router = express.Router();
const requiresAuth = require('../lib/requiresAuth');
const Profile = require('../models/profile');
const Tags = require('../models/tags');

router.use('*', requiresAuth);

router.get('/', async (req, res) => {
	try {
		const filters = req.query;
		const currentUser = await Profile.findOne({ user_id: req.user.id });
		const result = await Profile.findWithFilters(currentUser, filters);
		res.json(result);
	} catch (e) {
		console.error(e);
		res.sendStatus(500);
	}
});

router.get('/recommended', async (req, res) => {
	try {
		const filters = req.query;
		const currentUser = await Profile.findOne({ user_id: req.user.id });
		const result = await Profile.findRecomendedForUser(currentUser, filters);
		res.json(result);
	} catch (e) {
		console.error(e);
		res.sendStatus(500);
	}
});

module.exports = router;
