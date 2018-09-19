const db = require('../services/db');
const socketServer = require('../lib/socketServer');

exports.add = async (subject_user, actor_user, text) => {
	try {
		const connection = await db.get();

		let sql = 'INSERT INTO notifications SET ?';
		const values = {
			subject_user,
			actor_user,
			text
		}
		const result = await connection.query(sql, values);

		sql = `
			SELECT
				notifications.id,
				picture,
				first_name,
				last_name,
				login,
				text,
				seen,
				notifications.date
			FROM notifications
				INNER JOIN profile
					ON profile.user_id = notifications.actor_user
			WHERE notifications.id = ?
		`;
		const rows = await connection.query(sql, result.insertId);

		socketServer.notifyUser(subject_user, rows[0]);

		return result;
	} catch (e) {
		throw e;
	}
}

exports.getAllByUserId = async user_id => {
	try {
		const connection = await db.get();
		sql = `
			SELECT
				notifications.id,
				picture,
				first_name,
				last_name,
				login,
				text,
				seen,
				notifications.date
			FROM notifications
				INNER JOIN profile
					ON profile.user_id = notifications.actor_user
			WHERE subject_user = ?
			ORDER BY notifications.id DESC
		`;
		const rows = await connection.query(sql, user_id);
		return rows;
	} catch (e) {
		throw e;
	}
}

exports.setAllSeenByUserId = async user_id => {
	try {
		const connection = await db.get();
		sql = `
			UPDATE notifications
			SET seen = 1
			WHERE subject_user = ?
		`;
		const result = await connection.query(sql, user_id);
		return result;
	} catch (e) {
		throw e;
	}
}
