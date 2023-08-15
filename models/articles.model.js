const db = require("../db/connection");

exports.selectArticlesById = (id) => {
  return db
    .query(
      "SELECT author, title, article_id, body, topic, created_at, votes, article_img_url FROM articles WHERE article_id = $1;",
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          msg: `Article could not be found.`,
          status: 404,
        });
      }
      return rows[0];
    });
};

exports.selectArticles = () => {
  return db
    .query(
      `
    SELECT articles.author,
       articles.title,
       articles.article_id,
       articles.topic,
       articles.created_at,
       articles.votes,
       articles.article_img_url,
       Count(*)::INT AS comment_count
FROM   articles
       JOIN comments
         ON articles.article_id = comments.article_id
GROUP  BY articles.author,
          articles.title,
          articles.article_id,
          articles.topic,
          articles.created_at,
          articles.votes,
          articles.article_img_url
ORDER BY articles.created_at DESC;
    `
    )
    .then(({ rows }) => {
      return rows;
    });
};
