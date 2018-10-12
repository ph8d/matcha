const db = require('../services/db');
const crypto = require('crypto');

exports.add = async (user) => {
	const connection = await db.get();
	const sql = 'INSERT INTO user SET ?';
	const result = await connection.query(sql, user);
	return result;
};

exports.findOne = async (data) => {
	const connection = await db.get();
	const sql = 'SELECT * FROM user WHERE ?';
	const rows = await connection.query(sql, data);
	return rows[0];
};

exports.update = async (dataToFind, dataToUpdate) => {
	const connection = await db.get();
	const sql = 'UPDATE user SET ? WHERE ?';
	const result = await connection.query(sql, [dataToUpdate, dataToFind]);
	return result;
};

exports.genRecoveryRequest = async (userId) => {
	let hash = crypto.randomBytes(20).toString('hex');
	const connection = await db.get();
	let data = {
		id: hash,
		user_id: userId
	}
	const sql = 'INSERT recovery_requests SET ?';
	const result = await connection.query(sql, data);
	return hash;
};

exports.findRecoveryRequest = async (hash) => {
	const connection = await db.get()
	const sql = 'SELECT * FROM recovery_requests WHERE id = ?';
	const rows = await connection.query(sql, hash);
	return rows[0];
};

exports.delAllRecoveryRequestsByUserId = async (userId) => {
	const connection = await db.get()
	const sql = 'DELETE FROM recovery_requests WHERE user_id = ?';
	const result = await connection.query(sql, userId);
	return result;
};
