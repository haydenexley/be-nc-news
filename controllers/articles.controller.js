const { checkExists } = require("../db/seeds/utils");
const {
  selectArticlesById,
  selectArticles,
  selectArticleComments,
  updateVotes,
  selectArticleQueries,
} = require("../models/articles.model");

exports.getArticlesById = (request, response, next) => {
  const { article_id } = request.params;
  selectArticlesById(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (request, response, next) => {
  const { topic, sort_by, order } = request.query;
  if (topic) {
    const promises = [
      selectArticleQueries(topic, sort_by, order),
      checkExists("articles", "topic", topic),
    ];
    Promise.all(promises)
      .then((resolvedPromises) => {
        const articles = resolvedPromises[0];
        response.status(200).send({ articles });
      })
      .catch(next);
  } else {
    selectArticles(sort_by, order)
      .then((articles) => {
        response.status(200).send({ articles });
      })
      .catch(next);
  }
};

exports.getArticleComments = (request, response, next) => {
  const { article_id } = request.params;
  const promises = [
    selectArticleComments(article_id),
    checkExists("articles", "article_id", article_id),
  ];
  Promise.all(promises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[0];
      response.status(200).send({ comments });
    })
    .catch(next);
};

exports.patchVotes = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;
  const promises = [
    updateVotes(inc_votes, article_id),
    checkExists("articles", "article_id", article_id),
  ];
  Promise.all(promises)
    .then((resolvedPromises) => {
      const article = resolvedPromises[0];
      response.status(200).send({ article });
    })
    .catch(next);
};
