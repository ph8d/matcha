const db = require('../services/db');


exports.add = data => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = 'INSERT INTO likes SET ?';
				return connection.query(sql, data);
			})
			.then(result => {
				resolve(result);
			})
			.catch(reject);
	});
};

exports.delete = (user_id, liked_user_id) => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = 'DELETE FROM likes WHERE user_id = ? AND liked_user_id = ?';
				return connection.query(sql, [user_id, liked_user_id]);
			})
			.then(result => {
				resolve(result);
			})
			.catch(reject);
	});
};

exports.findAllByUserId = id => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = 'SELECT * FROM likes WHERE ? IN (user_id, liked_user_id)';
				return connection.query(sql, id);
			})
			.then(rows => {
				resolve(rows);
			})
			.catch(reject);
	});
};

exports.findOne = (user_id, liked_user_id) => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = `SELECT * FROM likes WHERE user_id = ? AND liked_user_id = ?`;
				return connection.query(sql, [user_id, liked_user_id]);
			})
			.then(rows => {
				resolve(rows[0]);
			})
			.catch(reject);
	});
}

exports.isLiked = async (currentUser, otherUser) => {
	try {
		const connection = await db.get();
		const sql = `
			SELECT COUNT(*) AS count
			FROM likes
			WHERE user_id = ? AND liked_user_id = ?
		`;
		const result = await connection.query(sql, [currentUser, otherUser]);
		return result[0].count;
	} catch (e) {
		throw e;
	}
}

exports.isMatch = (user_one_id, user_two_id) => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = `
					SELECT COUNT(*) as count
					FROM likes
						INNER JOIN likes AS liked_me
							ON likes.user_id = liked_me.liked_user_id
								AND likes.liked_user_id = liked_me.user_id
					WHERE likes.user_id = ? AND liked_me.user_id = ?
				`;
				return connection.query(sql, [user_one_id, user_two_id]);
			})
			.then(result => {
				resolve(result[0].count);
			})
			.catch(reject);
	});
}

exports.findAllMatchesForUserId = id => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = `
					SELECT liked_me.user_id, login, first_name, last_name, picture
					FROM likes
						INNER JOIN likes AS liked_me
							ON likes.user_id = liked_me.liked_user_id
							AND likes.liked_user_id = liked_me.user_id
						INNER JOIN profile
							ON profile.user_id = liked_me.user_id
					WHERE likes.user_id = ?
				`;
				return connection.query(sql, id);
			})
			.then(rows => {
				resolve(rows);
			})
			.catch(reject);
	});
};


/* E */
// SELECT
// profile.user_id,
// login,
// first_name,
// last_name, 
// picture,
// messages.author_id,
// messages.content,
// messages.date
// FROM messages
// INNER JOIN user_conversations
// 	ON user_conversations.conversation_id = messages.conversation_id
// INNER JOIN profile
// 	ON profile.user_id = user_conversations.user_id
// WHERE id IN (
// SELECT MAX(id)
// FROM messages
// WHERE conversation_id IN (1,2,3)
// GROUP BY conversation_id
// ) AND NOT user_conversations.user_id = 3

/* SQL for getting matches with minimal info for preview */

/* with user_conversation table */

// SELECT conversation_id, liked_me.user_id, login, first_name, last_name, picture
// FROM likes
// 	INNER JOIN likes AS liked_me
// 		ON likes.user_id = liked_me.liked_user_id
// 		AND likes.liked_user_id = liked_me.user_id
// 	INNER JOIN profile
// 	   ON profile.user_id = liked_me.user_id
// 	INNER JOIN user_conversations
// 		ON user_conversations.user_id = likes.user_id
// WHERE likes.user_id = 3

/* without it */

// SELECT liked_me.user_id, login, first_name, last_name, picture
// FROM likes
// 	INNER JOIN likes AS liked_me
// 		ON likes.user_id = liked_me.liked_user_id
// 		AND likes.liked_user_id = liked_me.user_id
//     INNER JOIN profile
//    		ON profile.user_id = liked_me.user_id
// WHERE likes.user_id = 3
