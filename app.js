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
  getArticleComments,
  patchVotes,
} = require("./controllers/articles.controller");

const app = express();
app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.patch("/api/articles/:article_id", patchVotes);

app.use(handleCustomErrors);
app.use(handleErrors);

app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send({ msg: err });
});

module.exports = app;
