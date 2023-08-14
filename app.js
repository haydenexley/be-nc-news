const express = require("express");
const {
  getTopics,
  getApi,
  getArticlesById,
} = require("./controllers/get.controller");
const {
  handleCustomErrors,
  handleErrors,
} = require("./controllers/errors.controller");

const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesById);

app.use(handleCustomErrors);
app.use(handleErrors);

app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send({ msg: err });
});

module.exports = app;
