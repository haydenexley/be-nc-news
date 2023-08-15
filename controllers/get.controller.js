const endpoints = require("../endpoints.json");
const { selectTopics, selectArticlesById } = require("../models/select.model");

exports.getApi = (request, response, next) => {
  response.status(200).send({ endpoints });
};

exports.getTopics = (request, response, next) => {
  selectTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch(next);
};

exports.getArticlesById = (request, response, next) => {
  const { article_id } = request.params;
  selectArticlesById(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch(next);
};
