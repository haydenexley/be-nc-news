const db = require("../db/connection");

exports.insertComment = (newComment, article_id) => {
  const { username, body } = newComment;
  const queryString = `
    INSERT INTO comments
    (body, author, article_id)
    VALUES
    ($1,$2,$3)
    RETURNING *;
    `;
  const values = [body, username, article_id];
  return db.query(queryString, values).then(({ rows }) => {
    return rows[0];
  });
};
