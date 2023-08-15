const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");

exports.selectArticlesById = (article_id) => {
  return db
    .query(
      `
SELECT author,
       title,
       article_id,
       body,
       topic,
       created_at,
       votes,
       article_img_url
FROM   articles
WHERE  article_id = $1; 
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
       JOIN articles
         ON comments.article_id = articles.article_id
WHERE  comments.article_id = $1
ORDER BY comments.created_at DESC;  
    `,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};
