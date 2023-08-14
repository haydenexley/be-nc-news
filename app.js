const express = require("express");
const { getTopics, getApi } = require("./controllers/topics.controller");
const endpointsList = ["GET /api", "GET /api/topics", "GET /api/articles"];

const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send({ msg: err });
});

module.exports = app;
