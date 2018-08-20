const multer = require('multer');
const crypto = require('crypto');

module.exports = {
	storage: multer.diskStorage({
		destination: function (req, file, next) {
			next(null, './public/images/upload');
		},
		filename: function (req, file, next) {
			console.log(file);
			let rand = crypto.randomBytes(20).toString('hex');
			let extension = file.mimetype.split('/')[1];
			next(null, `${rand}-${Date.now()}.${extension}`);
		}
	}),

	fileFilter: (req, file, next) => {
		if (!file) next();
		if (file.mimetype.startsWith('image/')) {
			console.log('This picture looking good');
			return next(null, true);
		} else {
			console.log('File format not suported');
			return next();
		}
	}
};