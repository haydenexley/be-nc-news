const express = require("express");
const {
  handleCustomErrors,
  handleErrors,
} = require("./controllers/errors.controller");
const { getApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");
const {
  getArticlesById,
  getArticles,
} = require("./controllers/articles.controller");

const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles", getArticles);

app.use(handleCustomErrors);
app.use(handleErrors);

app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send({ msg: err });
});

module.exports = app;
