const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'localhost',
    user : 'root',
    database : 'csc317',
    password : 'ABB10iote'
});

module.exports = db.promise();