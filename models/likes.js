const db = require('../services/db');


exports.add = async (data) => {
	const connection = await db.get()
	let sql = 'INSERT INTO likes SET ?';
	const result = await connection.query(sql, data);
	return result;
};

exports.delete = async (user_id, liked_user_id) => {
	const connection = await db.get();
	const sql = 'DELETE FROM likes WHERE user_id = ? AND liked_user_id = ?';
	const result = await connection.query(sql, [user_id, liked_user_id]);
	return result;
};

exports.findAllByUserId = async (id) => {
	const connection = await db.get();
	const sql = 'SELECT * FROM likes WHERE ? IN (user_id, liked_user_id)';
	const rows = await connection.query(sql, id);
	return rows;
};

exports.findOne = async (user_id, liked_user_id) => {
	const connection = await db.get()
	const sql = `SELECT * FROM likes WHERE user_id = ? AND liked_user_id = ?`;
	const rows = await connection.query(sql, [user_id, liked_user_id]);
	return rows[0];
}

exports.isLiked = async (currentUser, otherUser) => {
	const connection = await db.get();
	const sql = `
		SELECT COUNT(*) AS count
		FROM likes
		WHERE user_id = ? AND liked_user_id = ?
	`;
	const result = await connection.query(sql, [currentUser, otherUser]);
	return result[0].count;
}

exports.getForTwoUsers = async (user1, user2) => {
	const connection = await db.get();
	const users = [user1, user2, user1, user2];
	const sql = `
		SELECT *
		FROM likes
		WHERE
			likes.user_id IN (?,?)
			AND
			likes.liked_user_id IN (?,?)
	`
	const rows = await connection.query(sql, users);
	return rows;
}

exports.isMatch = async (user_one_id, user_two_id) => {
	const connection = await db.get();
	const sql = `
		SELECT COUNT(*) as isMatch
		FROM likes
			INNER JOIN likes AS liked_me
				ON likes.user_id = liked_me.liked_user_id
					AND likes.liked_user_id = liked_me.user_id
		WHERE likes.user_id = ? AND liked_me.user_id = ?
	`;
	const result = await connection.query(sql, [user_one_id, user_two_id]);
	return result[0].isMatch;
}

exports.findAllMatchesForUserId = async (id) => {
	const connection = await db.get();
	const sql = `
		SELECT liked_me.user_id, login, first_name, last_name, picture
		FROM likes
			INNER JOIN likes AS liked_me
				ON likes.user_id = liked_me.liked_user_id
				AND likes.liked_user_id = liked_me.user_id
			INNER JOIN profile
				ON profile.user_id = liked_me.user_id
		WHERE likes.user_id = ?
	`;
	const rows = await connection.query(sql, id);
	return rows;
};
