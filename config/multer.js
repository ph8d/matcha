const multer = require('multer');
const crypto = require('crypto');

const isSuportedMimeType = (mimetype) => {
	if (mimetype.includes('image/jpg')) {
		return true;
	} else if (mimetype.includes('image/jpeg')) {
		return true;
	} else if (mimetype.includes('image/png')) {
		return true;
	} else {
		return false;
	}
}

module.exports = {
	storage: multer.diskStorage({
		destination: function (req, file, next) {
			next(null, './public/uploaded/tmp');
		},
		filename: function (req, file, next) {
			let rand = crypto.randomBytes(20).toString('hex');
			let extension = file.mimetype.split('/')[1];
			next(null, `${rand}-${Date.now()}.${extension}`);
		}
	}),

	fileFilter: (req, file, next) => {
		if (!file) next();
		if (isSuportedMimeType(file.mimetype)) {
			return next(null, true);
		} else {
			return next(null, false);
		}
	}
};