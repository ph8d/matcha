const db = require('../services/db');

const toAscendingOrder = (x, y) => {
	return x > y ? [y , x] : [x, y];
};

exports.add = async message => {
	const connection = await db.get();
	const sql = 'INSERT INTO messages SET ?';
	const result = await connection.query(sql, message);
	return result;
};

exports.getUnreadCountPerConvForUser = async user_id => {
	const connection = await db.get();
	const sql = `
		SELECT messages.conversation_id, COUNT(*) AS number
		FROM user_conversations
			INNER JOIN messages
				ON messages.conversation_id = user_conversations.conversation_id
		WHERE user_conversations.user_id = ?
		AND messages.seen = 0
		AND NOT messages.author_id = ?
		GROUP BY messages.conversation_id
		ORDER BY messages.conversation_id ASC
	`;
	const result = await connection.query(sql, [user_id, user_id]);
	return result;
}

exports.findLastMsgPerConvForUser = async user_id => {
	const connection = await db.get();
	const sql = `
		SELECT messages.*
		FROM messages
			INNER JOIN user_conversations
				ON user_conversations.conversation_id = messages.conversation_id
		WHERE messages.id IN (
			SELECT MAX(id)
			FROM messages
			GROUP BY conversation_id
		) AND user_conversations.user_id = ?
		ORDER BY conversation_id
	`;
	const rows = await connection.query(sql, user_id);
	return rows;
}

exports.findAllByConvId = async (id) =>{
	const connection = await db.get();
	const sql = `
		SELECT *
		FROM messages
		WHERE conversation_id = ?
		ORDER BY messages.id ASC

	`;
	const result = await connection.query(sql, id);
	return result;
}

exports.setSeen = async (conversation_id, user_id) => {
	const connection = await db.get();
	const sql = `
		UPDATE messages
		SET seen = 1
		WHERE conversation_id = ?
		AND author_id = ?
	`;
	const result = await connection.query(sql, [conversation_id, user_id]);
	return result;
}
