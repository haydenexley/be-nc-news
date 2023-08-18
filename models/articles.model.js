const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");

exports.selectArticlesById = (article_id) => {
  return db
    .query(
      `
      SELECT articles.author,
      articles.title,
      articles.article_id,
      articles.body,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      Count(*)::INT AS comment_count
FROM   articles
      JOIN comments
        ON articles.article_id = comments.article_id
WHERE  articles.article_id = $1
GROUP  BY articles.author,
         articles.title,
         articles.article_id,
         articles.body,
         articles.topic,
         articles.created_at,
         articles.votes,
         articles.article_img_url;
      `,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          msg: `Not found.`,
          status: 404,
        });
      } else {
        return rows[0];
      }
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

exports.selectArticleComments = (article_id) => {
  return db
    .query(
      `
SELECT comments.comment_id,
       comments.votes,
       comments.created_at,
       comments.author,
       comments.body,
       comments.article_id
FROM   comments
WHERE  comments.article_id = $1
ORDER BY comments.created_at DESC;  
    `,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.updateVotes = (inc_votes, article_id) => {
  const queryString = `
UPDATE articles
SET    votes = votes            + $1
WHERE  article_id = $2 returning *; 
    `;
  const values = [inc_votes, article_id];
  return db.query(queryString, values).then(({ rows }) => {
    return rows[0];
  });
};
