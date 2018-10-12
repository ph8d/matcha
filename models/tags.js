const db = require('../services/db');

exports.findAll = async (data) => {
	const connection = await db.get();
	const sql = 'SELECT * FROM tags WHERE ?'
	const rows = await connection.query(sql, data);
	return rows;
}

exports.findOne = async (data) => {
	const connection = await db.get();
	const sql = 'SELECT * FROM tags WHERE ?'
	const rows = await connection.query(sql, data);
	return rows[0];
}

exports.add = async (tag) => {
	const connection = await db.get();
	const sql = 'INSERT INTO tags SET ?';
	const result = await connection.query(sql, tag);
	return result;
}

exports.insertMultiple = async (user_id, tags) => {
	const connection = await db.get();
	const sql = 'INSERT INTO tags (user_id, value) VALUES ?';
	const values = [];
	tags.forEach(value => {
		values.push([ user_id, value ]);
	});
	const result = await connection.query(sql, [values]);
	return result;
}

exports.delete = async (data) => {
	const connection = await db.get();
	const sql = 'DELETE FROM tags WHERE ?';
	const result = await connection.query(sql, data);
	return result;
};