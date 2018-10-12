const db = require('../services/db');

exports.findOne = async (data) => {
	const connection = await db.get();
	const sql = 'SELECT * FROM pictures WHERE ?';
	const rows = await connection.query(sql, data);
	return rows[0];
}

exports.findAll = async (data) => {
	const connection = await db.get();
	const sql = 'SELECT * FROM pictures WHERE ?';
	const rows = await connection.query(sql, data);
	return rows;
};

exports.findAllByUserIdArranged = async (user_id) => {
	const connection = await db.get();
	const sql = `
		SELECT *
		FROM pictures
		WHERE user_id = ?
		ORDER BY id IN (
			SELECT picture_id
			FROM profile
			WHERE user_id = ?
		) DESC, id ASC
	`;
	const rows = await connection.query(sql, [user_id, user_id]);
	return rows;
}

exports.add = async (picture) => {
	const connection = await db.get();
	const sql = 'INSERT INTO pictures SET ?';
	const result = await connection.query(sql, picture);
	return result;
};

exports.delete = async (data) => {
	const connection = await db.get();
	const sql = 'DELETE FROM pictures WHERE ?';
	const result = await connection.query(sql, data);
	return result;
};
