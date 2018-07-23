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

exports.add = (user, dbConnection) => {
    let sql = 'INSERT INTO user SET ?';
    let query = dbConnection.query(sql, user, (error, result) => {
        if (!!error) {
            console.log("Error in the query: " + error);
            return false;
        } else {
            console.log(result);
            return true;
        }
    });
};

exports.getOneByLoginInformation = (loginInfo, dbConnection) => {
    return new Promise((resolve, reject) => {
        db.get()
        .then(connection => {
            let sql = 'SELECT * FROM user WHERE login = ? AND password = ?';
            connection.query(sql, loginInfo, (error, rows, fields) => {
                if (error) throw error;
                if (rows.length > 0) {
                    resolve(rows);
                }
                reject('Login or password is incorrect');
            });
        });
    });
};

exports.getOneById = (userId, dbConnection) => {
    let sql = 'SELECT * FROM user WHERE id = ?';
    let query = dbConnection.query(sql, userId, (error, rows, fields) => {
        if (!!error) {
            console.log("Error in the query: " + error);
            return false;
        } else {
            console.log(rows);
            return true;
        }
    });
}

exports.getOneByLogin = (userLogin, dbConnection) => {
    let sql = 'SELECT * FROM user WHERE login = ?';
    let query = dbConnection.query(sql, userLogin, (error, rows, fields) => {
        if (!!error) {
            console.log("Error in the query: " + error);
            return false;
        } else {
            console.log(rows);
            return true;
        }
    });
}

exports.authenticate = (user) => {

    /* Need to add implementation */

}