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
const {
  postComment,
  deleteComment,
} = require("./controllers/comments.controller");
const { getUsers } = require("./controllers/users.controller");

const app = express();
app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchVotes);

app.delete("/api/comments/:comment_id", deleteComment);

app.use((_, response) => {
  response.status(404).send({ msg: "Not found." });
});

app.use(handleCustomErrors);
app.use(handleErrors);
app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send({ msg: err });
});

module.exports = app;
