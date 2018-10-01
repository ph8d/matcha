const db = require('../services/db');

const Messages = require('./messages');

const toAscending = (x, y) => {
	return x > y ? [y, x] : [x, y];
}

exports.create = async (user_one_id, user_two_id) => {
	try {
		const connection = await db.get();

		sql = 'INSERT INTO user_conversations (user_id, conversation_id) VALUES ?';
		const usersAsc = toAscending(user_one_id, user_two_id);
		const conversationId = `${usersAsc[0]}_${usersAsc[1]}`;
		const values = [
			[ user_one_id, conversationId ],
			[ user_two_id, conversationId ]
		];
		const result = await connection.query(sql, [values]);
		return result;
	} catch (e) {
		throw e;
	}
}

exports.findIdByUsers = async (user_one, user_two) => {
	try {
		const connection = await db.get();
		const sql = `
			SELECT conversation_id
			FROM user_conversations
			WHERE conversation_id IN (
				SELECT conversation_id
				FROM user_conversations
				WHERE user_id = ?
			) AND user_id = ?
		`;
		const result = await connection.query(sql, [user_one, user_two]);
		return result[0];
	} catch (e) {
		throw e;
	}
}

exports.findAllByUserId = id => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = `
					SELECT
						conversation_id,
						profile.user_id,
						login,
						first_name,
						last_name,
						pictures.src AS picture,
						online,
						last_seen
					FROM user_conversations
						INNER JOIN profile
							ON profile.user_id = user_conversations.user_id
						LEFT JOIN pictures
							ON pictures.id = profile.picture_id
					WHERE conversation_id IN (
						SELECT conversation_id
						FROM user_conversations
						WHERE user_id = ?
					) AND NOT user_conversations.user_id = ?
				`;
				return connection.query(sql, [id, id]);
			})
			.then(rows => {
				resolve(rows);
			})
			.catch(reject);
	});
};

exports.deleteById = async id => {
	try {
		const connection = await db.get();
		const sql = 'DELETE FROM user_conversations WHERE ?';
		const result = await connection.query(sql, id);
	} catch (e) {
		throw e;
	}
}
