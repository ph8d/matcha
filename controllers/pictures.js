const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(require('../config/multer')); // Error handling https://github.com/expressjs/multer#error-handling
const requiresAuth = require('../lib/requiresAuth');
const Picture = require('../models/picture');

const fs = require('fs');
const Jimp = require('jimp');

router.use('*', requiresAuth);

router.post('/', upload.single('picture'), async (req, res) => {
	try {
		if (!req.file || !req.body.croppData) {
			return res.sendStatus(400);
		}
	
		const croppData = JSON.parse(req.body.croppData);
		const src = `/uploaded/images/${req.file.filename}`;
		const absolute_path = `./public/uploaded/images/${req.file.filename}`;
		const originalPicture = await Jimp.read(req.file.path);
		const { x, y, width, height } = croppData;
	
		await originalPicture.crop(x, y, width, height).writeAsync(absolute_path);

		fs.unlink(req.file.path, err => {
			if (err) throw err;
		});
		
		const picture = {
			user_id: req.user.id,
			src,
			absolute_path,
		}

		const result = await Picture.add(picture);
		picture.id = result.insertId;
		res.json(picture);
	} catch (e) {
		console.error(e);
		res.sendStatus(500);
	}

});

router.delete('/:id', async (req, res) => {
	try {
		const picture = await Picture.findOne({ id: req.params.id });
		if (!picture) res.sendStatus(401);

		fs.unlink(picture.absolute_path, async err => {
			if (err) throw err;
			await Picture.delete({ id: req.params.id });
			res.sendStatus(200);
		});
	} catch (e) {
		throw e;
	}
})

module.exports = router;