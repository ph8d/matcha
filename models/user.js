const db = require('../services/db');

exports.logAllUsers = () => {
    db.get((error, connection) => {
        if (error) console.error(error);
        let sql = 'SELECT * FROM user';
        connection.query(sql, (error, rows, fields) => {
            if (error) console.error(error);
            console.log(rows);
        });
    });
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

exports.getById = (id, done) => {
    db.get((error, connection) => {
        if (error) return done(error);
        let sql = 'SELECT * FROM user WHERE id = ?';
        connection.query(sql, id, (error, rows, fields) => {
            if (error) return done(error);
            return done(null, rows[0]);
        });
    });                
}

exports.getByLogin = (login, done) => {
    db.get((error, connection) => {
        if (error) return done(error);
        let sql = 'SELECT * FROM user WHERE login = ?';
        connection.query(sql, login, (error, rows, fields) => {
            if (error) return done(error);
            return done(null, rows[0]);
        });
    });
}
