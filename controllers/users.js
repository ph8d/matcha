const express = require('express');
const router = express.Router();
const validator = require('../lib/validator');
const bcrypt = require('bcrypt');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const upload = multer(require('../config/multer'));
const requiresAuth = require('../lib/requiresAuth');
const fs = require('fs');
const Jimp = require('jimp');

const User = require('../models/user');
const Profile = require('../models/profile');
const Tags = require('../models/tags');
const Picture = require('../models/picture');
const Likes = require('../models/likes');
const Conversations = require('../models/conversations');
const Notifications = require('../models/notifications');
const BlockList = require('../models/block_list');
const ReportedUsers = require('../models/reported_users');


router.post('/register', validator.registrationValidation, async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if (req.validationErrors.length > 0) {
			return res.status(422).json({errors: req.validationErrors});
		}
		req.body.verification_hash = await User.add(email, password);
		next();
	} catch (e) {
		console.error(e);
		res.sendStatus(500);
	}
}, (req, res) => {
	const { email, verification_hash } = req.body;
	res.mailer.send('./emails/registration', {
		to: email,
		subject: 'Matcha | Registration',
		email,
		verification_hash
	}, error => {
		if (error) {
			console.error(error);
			res.sendStatus(500);
		} else {
			res.json({
				message: `
					Please, check your email and follow the instructions
					that we've sent to continue registration process.
				`
			});
		}
	});
});


router.post('/login', async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email })
		if (!user || user.is_verified === 0) {
			return res.sendStatus(401);
		}
		const isMatch = await bcrypt.compare(req.body.password, user.password)
		if (!isMatch) return res.sendStatus(401);

		jwt.sign({
			userId: user.id,
			login: user.login
		}, 'SECRET_KEY_THAT_I_NEED_TO_REPLACE_LATER', {
			expiresIn: '1h'
		}, (error, token) => {
			if (error) throw error;
			res.json({ token });
		});
	} catch (e) {
		console.error(e);
		res.sendStatus(401);
	}
});

router.get('/reset/:hash([0-9a-f]*)', async (req, res) => {
	try {
		const { hash } = req.params;
		const request = await User.findRecoveryRequest(hash);
		if (!request) {
			res.json({ status: false });
		} else {
			res.json({ status: true });
		}
	} catch (e) {
		console.error(e);
		res.sendStatus(500);
	}
})

router.post('/reset', async (req, res) => {
	try {
		const { hash: receivedHash, password } = req.body;
		const isHex = new RegExp(/^[0-9a-f]*$/i);

		if (!isHex.test(receivedHash) || !password) return res.sendStatus(401);

		const recoveryRequest = await User.findRecoveryRequest(receivedHash);
		if (!recoveryRequest) return res.sendStatus(401);
		if (!validator.isValidPassword(password)) {
			return res.status(202).json({ password: 'Password should be 8-24 symbols long, must contain at least one uppercase letter and a number.' });
		}
		
		const hashedPassword = await bcrypt.hash(password, 12)
		await User.update({ id:recoveryRequest.user_id }, { password:hashedPassword });
		await User.delAllRecoveryRequestsByUserId(recoveryRequest.user_id);
		res.json({ message: 'Your password was successfuly changed, you may log in now.' });
	} catch (e) {
		console.error(e);
		res.sendStatus(500);
	}
});


router.post('/recovery', async (req, res) => {
	try {
		const email = req.body.email;
		if (!validator.isValidEmail(email)) {
			return res.status(202).json({ email: 'Email is invalid.' });
		}

		const user = await User.findOne({ email })
		if (!user || !user.is_verified) {
			return res.json({ message: "We have sent instructions on how to reset your password to your email. If letter is not arriving check your spam folder and make sure you entered correct email adress." });
		}

		await User.delAllRecoveryRequestsByUserId(user.id)
		const hash = await User.genRecoveryRequest(user.id);
		res.mailer.send('./emails/recovery', {
			to: user.email,
			subject: 'Matcha | Password recovery',
			user: user,
			hash: hash
		}, error => {
			if (error) throw error;
			return res.json({ message: "We have sent instructions on how to reset your password to your email. If letter is not arriving check your spam folder and make sure you entered correct email adress." });
		});
	} catch (e) {
		console.error(e);
		res.sendStatus(500);
	}
});

router.get('/verify/:hash([0-9a-f]*)', async (req, res) => {
	try {
		const user = await User.findOne({ verification_hash: req.params.hash })
		if (!user) {
			return res.json({ status: false });
		}
		return res.json({ status: !user.is_verified });	
	} catch (e) {
		console.error(e);
		res.sendStatus(500);
	}
});

router.get('/exists/:login', async (req, res) => {
	try {
		const login = req.params.login;
		const profile = await Profile.findOne({ login });
		res.json({ exists: !!profile });
	} catch (e) {
		console.error(error);
		res.sendStatus(500);
	}
});

router.post('/profile/:hash([0-9a-f]*)', upload.single('picture'), async (req, res, next) => {
	const user = await User.findOne({ verification_hash: req.params.hash });
	if (!user) return res.sendStatus(401);

	const { profile, tags, croppData } = req.body;
	if (!profile|| !tags || !req.file || !croppData) {
		return res.sendStatus(400);
	}

	req.body.profile = JSON.parse(profile);
	req.body.croppData = JSON.parse(req.body.croppData);
	req.body.profile.user_id = user.id;

	return next();
}, async (req, res, next) => {
	const { filename, path } = req.file;
	const { x, y, width, height } = req.body.croppData;
	
	const absolute_path = `./public/uploaded/images/${filename}`;
	const src = `/uploaded/images/${filename}`;

	const image = await Jimp.read(path);
	await image
		.crop(x, y, width, height)
		.quality(75)
		.writeAsync(absolute_path);

	fs.unlink(req.file.path, async (err) => {
		if (err) {
			console.error(err);
			res.sendStatus(500);
		};

		const picResult = await Picture.add({
			user_id: req.body.profile.user_id,
			src,
			absolute_path
		});

		req.body.profile.picture_id = picResult.insertId;
		return next();
	});
}, async (req, res) => {
	const { profile, tags } = req.body;

	await Profile.create(profile);
	await Tags.insertMultiple(profile.user_id, tags);
	await User.update({ id: profile.user_id }, { is_verified: 1 });

	res.json({ message: 'Registration successful! You may log in now.' });
});

router.all('*', requiresAuth);

router.post('/update/email', validator.emailValidation, async (req, res) => {
	const { email } = req.body;
	if (req.validationErrors.length > 0) {
		return res.status(422).json({errors: req.validationErrors});
	}
	await User.update({ id: req.user.id }, { email });
	res.sendStatus(200); 
});

router.post('/update/password', validator.passwordValidation, async (req, res) => {

})

router.post('/update/profile', async (req, res) => {
	try {
		const { profile, tags } = req.body;
		const response = {};
		if (profile) {
			await Profile.update({ user_id: req.user.id }, profile);
			response.profile = profile;
		}

		if (tags) {
			await Tags.delete({ user_id: req.user.id });
			if (tags.length > 0) {
				await Tags.insertMultiple(req.user.id, tags);
			}
			response.tags = await Tags.findAll({ user_id: req.user.id });
		}
		
		res.json(response);
	} catch (e) {
		console.error(e);
		res.sendStatus(500);
	}
});


router.get('/self', async (req, res) => {
	try {
		const user_id = req.user.id;

		const getEmail = User.findOneGetColumns(['email'], { id: user_id });
		const getProfile = Profile.findOne({ user_id });
		const getPictures = Picture.findAllByUserIdArranged(user_id);
		const getTags = Tags.findAll({ user_id });
		const getNotifications = Notifications.getAllByUserId(user_id);

		const { email } = await getEmail;
		const user = {
			email,
			profile: await getProfile,
			pictures: await getPictures,
			tags: await getTags,
			notifications: await getNotifications
		};

		res.json(user);
	} catch (e) {
		console.error(e);
		res.sendStatus(500);
	}
});

router.get('/self/history', async (req, res) => {
	try {
		const user_id = req.user.id;
		const result = await Notifications.getAllVisitsByUserId(user_id);
		res.json(result);
	} catch (e) {
		console.error(e);
		res.sendStatus(500);
	}
});

router.get('/:login', async (req, res) => {
	try {
		const currentUser = await Profile.findOne({ user_id: req.user.id });
		const { lat, lng } = currentUser;

		const profile = await Profile.findOneAndComputeDistance({ login: req.params.login }, { lat, lng });
		if (!profile) {
			return res.status(404).json({ error: "User with this login doesn't exsist." });
		}

		const getPictures = Picture.findAllByUserIdArranged(profile.user_id);
		const getTags = Tags.findAll({ user_id: profile.user_id });
		const getBlockedStatus = BlockList.isBlocked(req.user.id, profile.user_id);
		const getLikeStatus = Likes.isLiked(req.user.id, profile.user_id);
		const getLikesMe = Likes.isLiked(profile.user_id, req.user.id);

		const user = {
			status: {
				isBlocked: await getBlockedStatus,
				isLiked: await getLikeStatus,
				likesMe: await getLikesMe,
			},
			profile,
			pictures: await getPictures,
			tags: await getTags
		};

		res.json(user);
	} catch (e) {
		console.error(e);
		res.sendStatus(500);
	}
});

router.post('/:login/like', async (req, res) => {
	const currentUser = req.user.id;
	let notificationType = 2;
	try {
		const profile = await Profile.findOne({ login: req.params.login });
		if (!profile) {
			return res.status(404).json({ error: "User with this login doesn't exsist." });
		}
		const alreadyLiked = await Likes.findOne(currentUser, profile.user_id);
		if (alreadyLiked) {
			return res.json({ error: 'Already liked this user.' });
		}
		await Likes.add({ user_id: currentUser, liked_user_id: profile.user_id });
		const match = await Likes.isMatch(currentUser, profile.user_id);
		if (match) {
			await Conversations.create(currentUser, profile.user_id);
			notificationType = 4;
			await Notifications.add(notificationType, currentUser, profile.user_id)
		}
		await Notifications.add(notificationType, profile.user_id, currentUser);
		return res.json({ status: "Successfuly liked." });
	} catch (e) {
		console.error(e);
		res.sendStatus(500);
	}
});

router.delete('/:login/like', async (req, res) => {
	const currentUser = req.user.id;
	try {
		const profile = await Profile.findOne({ login: req.params.login });
		if (!profile) {
			return res.status(404).json("User with this login doesn't exsist.");
		}
		const alreadyLiked = await Likes.findOne(currentUser, profile.user_id);
		if (alreadyLiked) {
			await Likes.delete(currentUser, profile.user_id);
			const conversationId = await Conversations.findIdByUsers(currentUser, profile.user_id);
			if (conversationId) {
				await Conversations.deleteById(conversationId);
			}
		}
		await Notifications.add(3, profile.user_id, currentUser);
		return res.json({ status: "Successfuly removed like." });
	} catch (e) {
		console.error(e);
		res.sendStatus(500);
	}
});

router.post('/:login/block', async (req, res) => {
	try {
		const user_id = req.user.id;
		const profile = await Profile.findOne({ login: req.params.login });
		if (!profile) {
			return res.status(404).json("User with this login doesn't exsist.");
		}
		const isAlreadyBlocked = await BlockList.isBlocked(user_id, profile.user_id);
		if (isAlreadyBlocked) {
			return res.json({ error: 'This user is already blocked.' });
		}
		await BlockList.add({ user_id, blocked_id: profile.user_id });
		return res.json({ status: "User was added to your block list." });
	} catch (e) {
		console.error(e);
		res.sendStatus(500);
	}
});

router.delete('/:login/block', async (req, res) => {
	try {
		const user_id = req.user.id;
		const profile = await Profile.findOne({ login: req.params.login });
		if (!profile) {
			return res.status(404).json({ error: "User with this login doesn't exsist." });
		}
		await BlockList.delete(user_id, profile.user_id);
		res.json({ status: "User was removed from your block list." });
	} catch (e) {
		console.error(e);
		res.sendStatus(500);
	}
})

router.post('/:login/report', async (req, res) => {
	try {
		const reason = req.body.reason;
		const profile = await Profile.findOne({ login: req.params.login });
		if (!profile) {
			return res.status(404).json({ error: "User with this login doesn't exsist." });
		}
		await ReportedUsers.add({
			report_from_id: req.user.id,
			reported_id: profile.user_id,
			reason
		});
		res.json({ status: "User was reported." });
	} catch (e) {
		console.error(e);
		res.sendStatus(500);
	}
});

module.exports = router;
