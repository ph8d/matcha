const express = require('express');
const router = express.Router();
const requiresAuth = require('../lib/requiresAuth');
const Profile = require('../models/profile');
const Tags = require('../models/tags');

router.use('*', requiresAuth);

router.get('/', (req, res) => {
	console.log(req, query);
	res.sendStatus(200);
});

router.get('/recommended', async (req, res) => {
	try {
		const filters = req.query;
		const filterTags = filters.tags || []
	
		const currentUser = await Profile.findOne({ user_id: req.user.id });
		const userTags = await Tags.findAll({ user_id: req.user.id });
		
		userTags.forEach(tag => {
			filterTags.push(tag.value);
		});
		filters.tags = filterTags;

		console.log(filters);
		const result = await Profile.findRecomendedForUser(currentUser, filters);
		res.json(result);
	} catch (e) {
		console.error(e);
		res.sendStatus(500);
	}
});

module.exports = router;
