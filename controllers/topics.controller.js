const endpoints = require("../endpoints.json");
const { selectTopics } = require("../models/topics.model");

exports.getApi = (request, response, next) => {
  response.status(200).send({ endpoints }).catch(next);
};

exports.getTopics = (request, response, next) => {
  selectTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch(next);
};
