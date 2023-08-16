const { insertComment } = require("../models/comments.model");

exports.postComment = (request, response, next) => {
  const { article_id } = request.params;
  const newComment = request.body;
  insertComment(newComment, article_id)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch(next);
};
