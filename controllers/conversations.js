const express = require('express');
const router = express.Router();
const requiresAuth = require('../lib/requiresAuth');

const Profile = require('../models/profile');
const Conversations = require('../models/conversations');
const Messages = require('../models/messages');

router.all('*', requiresAuth);

router.get('/', async (req, res) => {
	const currentUser = req.user.id;

	try {
		const getConversations = Conversations.findAllByUserId(currentUser);
		const getUnreadCounts = Messages.getUnreadCountPerConvForUser(currentUser);
		const getLastMessages = Messages.findLastMsgPerConvForUser(currentUser);

		const conversations = await getConversations;
		const unreadCounts = await getUnreadCounts;
		const lastMessages = await getLastMessages;

		conversations.forEach((conversation, i) => {
			conversation.unread = 0;
			conversation.messages = [];
			lastMessages.forEach(message => {
				if (message.conversation_id === conversation.conversation_id) {
					conversation.messages.push(message);
				}
			});
			unreadCounts.forEach(count => {
				if (count.conversation_id === conversation.conversation_id) {
					conversation.unread = count.number;
				}
			});
			conversations[i] = conversation;
		});
		res.json(conversations);
	} catch (e) {
		console.error(e);
		res.sendStatus(500);
	}
});

router.get('/:login', async (req, res) => {
	try {
		const profile = await Profile.findOne({ login: req.params.login });
		if (!profile) {
			return res.status(404).json({ error: "User with this login doesn't exsist." });
		}
		const conversation = await Conversations.findIdByUsers(req.user.id, profile.user_id);
		if (!conversation) {
			res.status(404).json({ error: "You have no conversation with this user." });
		}
		const messages = await Messages.findAllByConvId(conversation.conversation_id);
		res.json(messages);
	} catch (e) {
		console.error(e);
		res.sendStatus(500);
	}
});

module.exports = router;
