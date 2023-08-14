const db = require("../db/connection");
const format = require("pg-format");

exports.selectTopics = () => {
  return db.query("SELECT slug, description FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.selectArticlesById = (id) => {
  const queryString = format(
    `SELECT author, title, article_id, body, topic, created_at, votes, article_img_url FROM articles WHERE article_id = %L`,
    [id]
  );
  return db.query(queryString).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        msg: `Article could not be found.`,
        status: 404,
      });
    }
    return rows[0];
  });
};
