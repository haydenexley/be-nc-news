const express = require("express");
const { getTopics } = require("./controllers/topics.controller");

const app = express();

app.get("/api/topics", getTopics);

app.use((err, request, response, next) => {
  response.status(500).send({ msg: err });
});

module.exports = app;
