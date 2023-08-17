const { checkExists } = require("../db/seeds/utils");
const { insertComment, removeComment } = require("../models/comments.model");

exports.postComment = (request, response, next) => {
  const { article_id } = request.params;
  const newComment = request.body;
  insertComment(newComment, article_id)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (request, response, next) => {
  const { comment_id } = request.params;
  const promises = [
    removeComment(comment_id),
    checkExists("comments", "comment_id", comment_id),
  ];
  Promise.all(promises)
    .then(() => {
      response.status(204).send();
    })
    .catch(next);
};
