const {
  selectArticlesById,
  selectArticles,
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
  selectArticles().then((articles) => {
    response.status(200).send({ articles });
  });
};
