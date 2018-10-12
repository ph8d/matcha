const db = require('../services/db');

exports.add = async (data) => {
	const connection = await db.get();
	const sql = 'INSERT INTO reported_users SET ?';
	const result = await connection.query(sql, data);
	return result;
}

exports.findOne = async (data) => {
	const connection = await db.get();
	const sql = 'SELECT * FROM reported_users WHERE ?';
	const rows = await connection.query(sql, data);
	return rows[0];
}

exports.findAll = async (data) => {
	const connection = await db.get();
	const sql = 'SELECT * FROM reported_users WHERE ?';
	const rows = await connection.query(sql, data);
	return rows;
}