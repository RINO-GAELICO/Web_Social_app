const db = require("../Db/database");
const CommentModel = {};


CommentModel.create = (userId, postId, comment) => {
    let baseSQL = `INSERT INTO comments (commentText, postId, authorId) VALUES (?,?,?);`

    return db.query(baseSQL, [comment, postId, userId])
        .then(([results, fields]) => {
            if (results && results.affectedRows) {
                return Promise.resolve(results.insertId);
            } else {
                return Promise.resolve(-1);
            }
        })
        .catch((err) => Promise.reject(err));
};

CommentModel.getCommentsForPost = (postId) => {
    let baseSQL = `SELECT u.Username, c.commentText, c.creationTime, c.commentId 
    FROM comments c
    JOIN users u
    ON u.id=c.authorId
    WHERE c.postId=?
    ORDER BY c.creationTime DESC`
    return db.query(baseSQL, [postId])
        .then(([results, fields])=> {
            return Promise.resolve(results);
        })
        .catch(err => Promise.reject(err));

};


module.exports = CommentModel;