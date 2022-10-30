const db = require("../Db/database");

const PostModel = {};

PostModel.create = (title, postText, photoPath, thumbnail, authorId) => {
    let baseSQL = 'INSERT INTO posts (title, postText, photopath, thumbnail, creationTime, authorId) VALUE (?,?,?,?,now(),?);';
    return db.execute(baseSQL,[title,postText,photoPath,thumbnail,authorId])
        .then(([results,fields])=>{
            return Promise.resolve(results && results.affectedRows);

        })
        .catch((err) => Promise.reject(err));
}

PostModel.search = (searchTerm) =>{
    let baseSQL = "SELECT postId, title, postText, thumbnail, concat_ws(' ', title, postText) AS haystack FROM posts HAVING haystack like ?;"
    let sqlReadySearchTerm = "%"+searchTerm+"%";
    return db.execute(baseSQL, [sqlReadySearchTerm])
        .then(([results,fields]) => {
            return Promise.resolve(results);
        })
        .catch((err)=> Promise.reject(err));
}

PostModel.getRecentPosts = (numberOfPosts) => {
    let baseSQL = 'SELECT postId, title, postText, thumbnail, creationTime FROM posts ORDER BY creationTime DESC LIMIT ?';
    return db.execute(baseSQL, [''+numberOfPosts])
        .then(([results, fields]) => {
            return Promise.resolve(results);
        })
        .catch((err) => Promise.reject(err));
}

PostModel.getPostById = (postId) => {
    let baseSQL = `SELECT p.postId, u.Username, p.title, p.postText, p.photoPath, p.creationTime\n FROM users u JOIN posts p\n ON u.id = p.authorId\n WHERE p.postId = ?;`;

    return db.execute(baseSQL, [postId])
        .then(([results,fields]) => {
               return Promise.resolve(results);
        })
        .catch((err) => Promise.reject(err))
}

/*
To make objects available outside of a module
you just need to expose them as additional properties on the exports object.
BUT
If you want to export a complete object in one assignment instead of building it one property at a time,
assign it to module.exports as shown below
 */
module.exports = PostModel;