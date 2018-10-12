const db = require('../services/db');

exports.add = async (data) => {
	const connection = await db.get();
	const sql = 'INSERT INTO block_list SET ?';
	const result = await connection.query(sql, data);
	return result;
}

exports.delete = async (user_id, blocked_id) => {
	const connection = await db.get();
	const sql = 'DELETE FROM block_list WHERE user_id = ? AND blocked_id = ?';
	const result = await connection.query(sql, [user_id, blocked_id]);
	return result;
}

exports.isBlocked = async (userId, blockedId) => {
	const connection = await db.get();
	const sql = 'SELECT COUNT(*) as count FROM block_list WHERE user_id = ? AND blocked_id = ?';
	const result = await connection.query(sql, [userId, blockedId]);
	return result[0].count;
}

exports.findAll = async (data) => {
	const connection = await db.get();
	const sql = 'SELECT * FROM block_list WHERE ?';
	const rows = await connection.query(sql, data);
	return rows;
}
