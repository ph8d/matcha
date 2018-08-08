const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	console.log(req.connection.remoteFamily);
	res.render('home');
});

router.get('/about', (req, res) => {
	res.render('about');
});

module.exports = router;
