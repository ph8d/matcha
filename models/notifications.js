const db = require('../services/db');
const socketServer = require('../lib/socketServer');

exports.add = async (type_id, subject_user, actor_user) => {
	try {
		const connection = await db.get();

		let sql = 'INSERT INTO notifications SET ?';
		const values = {
			type_id,
			subject_user,
			actor_user
		}
		const result = await connection.query(sql, values);

		sql = `
			SELECT
				notifications.id,
				notifications.type_id,
				notifications.actor_user,
				pictures.src AS picture,
				first_name,
				last_name,
				login,
				seen,
				notifications.date
			FROM notifications
				INNER JOIN profile
					ON profile.user_id = notifications.actor_user
				LEFT JOIN pictures
					ON pictures.id = profile.picture_id
			WHERE notifications.id = ?
			ORDER BY notifications.id DESC
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
				notifications.type_id,
				notifications.actor_user,
				pictures.src AS picture,
				first_name,
				last_name,
				login,
				seen,
				notifications.date
			FROM notifications
				INNER JOIN profile
					ON profile.user_id = notifications.actor_user
				LEFT JOIN pictures
					ON pictures.id = profile.picture_id
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
