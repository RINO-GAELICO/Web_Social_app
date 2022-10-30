
var db = require('../Db/database');
const UserModel = {};
var bcrypt = require('bcrypt');


UserModel.create = (username, password, email) => {
    return bcrypt.hash(password,15)
        .then((hashedPassword) => {
            let sqlCommand = "INSERT INTO users (Username, Email, password, creationTime) VALUES (?,?,?,now())";
            return db.execute(sqlCommand, [username, email, hashedPassword]);
    })
        .then(([results,fields])=> {
            if(results && results.affectedRows){
                return Promise.resolve(results.insertId);
            }else{
                return Promise.resolve(-1);
            }
        })
        .catch((err)=> Promise.reject(err));
}

UserModel.usernameExists = (username) => {
    return db.execute("SELECT * FROM users WHERE Username=?",
        [username])
        .then(([results,fields]) => {
             return Promise.resolve(!(results && results.length==0));
        })
        .catch((err) => Promise.reject(err));
}


UserModel.emailExists = (email) =>{
    return db.execute("SELECT * FROM users WHERE Email=?",
        [email])
        .then(([results,fields]) => {
            return Promise.resolve(!(results && results.length==0));
        })
        .catch((err) => Promise.reject(err));
}


UserModel.authenticate = (username, password) =>{
    let userId;
    let baseSQL = "SELECT * FROM users WHERE Username=?;";
    return db.execute(baseSQL, [username])
        .then(([results,fields]) => {
            if(results && results.length==1){
                userId = results[0].id;
                return bcrypt.compare(password, results[0].password);
            }else{
                return Promise.reject(-1);
            }
        })
        .then((passwordMatch) => {
            if(passwordMatch){
                return Promise.resolve(userId);
            }else{
                return Promise.resolve(-1);
            }
        })
        .catch((err)=> Promise.reject(err));
}




module.exports = UserModel;