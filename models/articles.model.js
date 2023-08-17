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

exports.selectArticles = (sort_by = "created_at", order = "desc") => {
  const allowedSorts = ["title", "article_id", "topic", "created_at", "votes"];
  const allowedOrders = ["asc", "desc"];
  if (!allowedSorts.includes(sort_by) || !allowedOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request." });
  }
  const queryString = `SELECT articles.author,
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
ORDER BY ${sort_by} ${order}`;
  return db.query(queryString).then(({ rows }) => {
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

exports.selectArticleQueries = (topic, sort_by, order) => {
  return this.selectArticles(sort_by, order).then((articles) => {
    const queryTopics = articles.filter(
      (article) => article["topic"] === topic
    );
    return queryTopics;
  });
};
