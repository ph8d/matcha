const db = require('../services/db');

exports.logAllUsers = () => {
    db.get()
        .then(connection => {
            let sql = 'SELECT * FROM user';
            connection.query(sql, (error, rows, fields) => {
                if (error) throw error;
                console.log(rows);
            });
        })
        .catch(console.error);
};

exports.add = (user) => {
    db.get()
        .then(connection => {
            let sql = 'INSERT INTO user SET ?';
            connection.query(sql, user, (error, result) => {
                if (!!error) {
                    console.log("Error in the query: " + error);
                } else {
                    console.log(result);
                }
            });
        })
        .catch(console.error);
};

exports.getById = (id) => {
    return new Promise((resolve, reject) => {
        db.get()
            .then(connection => {
                let sql = 'SELECT * FROM user WHERE id = ?';
                connection.query(sql, id, (error, rows, fields) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(rows[0]);
                    }
                });                
            })
            .catch(console.error);
    });
}

exports.getOneByLogin = (userLogin) => {
    return new Promise((resolve, reject) => {
        db.get()
            .then(connection => {
                let sql = 'SELECT * FROM user WHERE login = ?';
                connection.query(sql, userLogin, (error, rows, fields) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(rows[0]);
                    }
                });
            })
            .catch(console.error);
    });
}
