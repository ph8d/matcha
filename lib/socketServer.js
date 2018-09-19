const Messages = require('../models/messages');
const Notifications = require('../models/notifications');

let io = null

exports.init = http => {
	io = require('socket.io')(http , {
		pingInterval: 10000,
		pingTimeout: 5000,
	});

	io.on('connection', async (client) => {
		client.user_id = client.handshake.query.user_id;
		client.join(client.user_id);
		console.log('New connection - ', client.user_id);
	
		client.on('join conversation', async data => {
			const { conversation_id, user_id } = data;
			client.join(`conversation_${conversation_id}`);
			console.log(`${client.id} joined conversation ${conversation_id}`);
			await Messages.setSeen(conversation_id, user_id);
		});
	
		client.on('leave conversation', conversation_id => {
			client.leave(`conversation_${conversation_id}`);
			console.log(`${client.id} left conversation ${conversation_id}`);
		});
	
		client.on('notifications seen', async user_id => {
			console.log(`client.user_id = ${client.user_id}`);
			await Notifications.setAllSeenByUserId(user_id);
			console.log(`All notifications for user ${user_id} was set as seen.`);
		});
	
		client.on('send message', async (data) => {
			try {
				const { message, recipient } = data;
				const conversationRoom = `conversation_${message.conversation_id}`;
				io.in(conversationRoom).clients(async (err, clients) => {
					if (err) throw err;
					const result = await Messages.add(message);
					message.id = result.insertId
					client.to(conversationRoom).emit('new message', message);
					if (clients.length < 2) {
						const notification = {
							type: 'message',
							data: message
						}
						client.to(recipient).emit('notification', notification);
					}
				});
			} catch (e) {
				console.error(e);
			}
		})
	
		client.on('disconnect', () => {
			console.log("Disconnected - ", client.id);
		})
	});
}

exports.notifyUser = (user, notification) => {
	io.to(user).emit('notification', notification);
}
