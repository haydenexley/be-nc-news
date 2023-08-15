const { checkExists } = require("../db/seeds/utils");
const {
  selectArticlesById,
  selectArticles,
  selectArticleComments,
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
  selectArticles()
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch(next);
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
