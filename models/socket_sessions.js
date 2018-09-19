const db = require('../services/db');

exports.findOne = async (data) => {
	try {
		const connection = await db.get();
		const sql = "SELECT * FROM socket_sessions WHERE ?"
		const rows = connection.query(sql, data);
		return rows[0];
	} catch (e) {
		console.error(e)
	}
}

exports.create = async (user_id, socket_id) => {
	try {
		const connection = await db.get();
		const sql = 'INSERT INTO socket_sessions (user_id, socket_id) VALUES ?';
		const result = await connection.query(sql, [[[user_id, socket_id]]]);
		return result;
	} catch (e) {
		console.error(e);
	}
}

exports.remove = async (user_id, socket_id) => {
	try {
		const connection = await db.get();
		const sql = 'DELETE FROM socket_sessions WHERE user_id = ? AND socket_id = ?';
		const result = await connection.query(sql, [user_id, socket_id]);
		return result;
	} catch (e) {
		console.error(e);
	}
}
