const Profile = require('../models/profile');
const Messages = require('../models/messages');
const Notifications = require('../models/notifications');
const BlockList = require('../models/block_list');

let io = null

exports.init = http => {
	io = require('socket.io')(http , {
		pingInterval: 10000,
		pingTimeout: 5000,
	});

	io.on('connection', async (client) => {
		client.user_id = client.handshake.query.user_id;
		client.join(client.user_id);

		Profile.update({ user_id: client.user_id }, {online: 1});

		console.log('New connection - ', client.user_id);
	
		client.on('join conversation', async (conversation_id, user_id) => {
			client.join(`conversation_${conversation_id}`);

			await Messages.setSeen(conversation_id, user_id);

			const status = await Profile.isOnline(user_id);
			io.to(client.user_id).emit('status update', status);
			console.log(`${client.id} joined conversation ${conversation_id}`);
		});
	
		client.on('leave conversation', (conversation_id) => {
			client.leave(`conversation_${conversation_id}`);
			console.log(`${client.id} left conversation ${conversation_id}`);
		});
	
		client.on('notifications seen', async user_id => {
			console.log(`client.user_id = ${client.user_id}`);
			await Notifications.setAllSeenByUserId(user_id);
			console.log(`All notifications for user ${user_id} was set as seen.`);
		});

		client.on('profile visit', async user_id => {
			await Notifications.add(1, user_id, client.user_id)
		})
	
		client.on('send message', async (data) => {
			try {
				const { message, recipient } = data;
				const conversationRoom = `conversation_${message.conversation_id}`;

				const isBlocked = await BlockList.isBlocked(recipient, client.user_id);
				if (isBlocked) return;

				io.in(conversationRoom).clients(async (err, clients) => {
					if (err) throw err;

					const result = await Messages.add(message);
					message.id = result.insertId

					client.to(conversationRoom).emit('new message', message);

					if (clients.length < 2) {
						const authorProfile = await Profile.findOneWithPicture({ user_id: client.user_id });
						const { picture, first_name, last_name } = authorProfile;
						io.to(recipient).emit('notification', {
							type_id: 5,
							picture,
							first_name,
							last_name,
							message
						});
					}
				});
			} catch (e) {
				console.error(e);
			}
		})
	
		client.on('disconnect', () => {
			Profile.update({ user_id: client.user_id }, { online: 0 });
			console.log("Disconnected - ", client.id);
		})
	});
}

exports.notifyUser = (user, notification) => {
	io.to(user).emit('notification', notification);
}

exports.emitTo = (recipient, event, data) => {
	io.to(recipient).emit(event, data);
}
