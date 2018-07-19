const mysql = require('mysql');

class Db {
    constructor() {
        this._connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'gjrf123',
            database: 'matcha',
        });
    };

    addUser(user) {
        let sql = 'INSERT INTO user SET ?';
        let query = this._connection.query(sql, user, (error, result) => {
            if (!!error) {
                console.log("Error in the query: " + error);
                return false;
            } else {
                console.log(result);
                return true;
            }
        });
    };
    
    getUserById(id) {
        let sql = 'SELECT * FROM user WHERE id = ?'
        this._connection.query(sql, id, (error, rows, fields) => {
            if (!!error) {
                console.log("Error in the query: " + error);
                return false;
            } else {
                console.log(rows);
                return true;
            }
	    });
    };

    getUserByLogin(login) {
        let sql = 'SELECT * FROM user WHERE login = ?';
        this._connection.query(sql, login, (error, rows, fields) => {
            if (!!error) {
                console.log("Error in the query: " + error);
                return false;
            } else {
                console.log(rows);
                return true;
            }
        });
    }

    logAllUsers() {
        let sql = 'SELECT * FROM user';
        this._connection.query(sql, (error, rows, fields) => {
            if (!!error) {
                console.log("Error in the query: " + error);
                return false;
            } else {
                console.log(rows);
                return true;
            }
	    });
    };
}

module.exports = Db;