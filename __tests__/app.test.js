const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const endpointsJSON = require("../endpoints.json");
const seed = require("../db/seeds/seed");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/");

beforeEach(() => {
  return seed({ topicData, userData, articleData, commentData });
});

afterAll(() => {
  return db.end();
});

describe("app", () => {
  describe("ALL error handling", () => {
    test("404: responds with 404 when given an endpoint that does not exist", () => {
      return request(app).get("/api/biscoff").expect(404);
    });
  });
  describe("GET /api", () => {
    test("200: responds with a status of 200", () => {
      return request(app).get("/api").expect(200);
    });
    test("200: responds with an object containing all endpoints usable in the API", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: { endpoints } }) => {
          expect(endpoints).toEqual(endpointsJSON);
        });
    });
  });
  describe("GET /api/topics", () => {
    test("200: responds with a status of 200", () => {
      return request(app).get("/api/topics").expect(200);
    });
    test("200: responds with an array of the correct amount of topic objects that have the keys of slug and description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).toHaveLength(3);
          topics.forEach((topic) => {
            expect(topic).toHaveProperty("slug", expect.any(String));
            expect(topic).toHaveProperty("description", expect.any(String));
          });
        });
    });
  });
  describe("GET /api/articles/:article_id", () => {
    test("200: responds with a status of 200", () => {
      return request(app).get("/api/articles/1").expect(200);
    });
    test("200: responds with correct article data for relevant article", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("body", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
        });
    });
    test("404: responds with 404 and an error message when given an article_id that is valid but does not exist", () => {
      return request(app)
        .get("/api/articles/20000")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(`Not found.`);
        });
    });
    test("400: responds with 400 and an error message when given an article_id that is invalid", () => {
      return request(app)
        .get("/api/articles/hello")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request.");
        });
    });
    test("Endpoint has a relevant description in the 'endpoints.json' file", () => {
      return request(app)
        .get("/api")
        .then(({ body: { endpoints } }) => {
          expect(endpoints).toHaveProperty("GET /api/articles/:article_id");
        });
    });
  });

  describe("GET /api/articles", () => {
    test("200: responds with a 200 status code", () => {
      return request(app).get("/api/articles").expect(200);
    });
    test("200: responds with correct article data for all articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach((article) => {
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("title", expect.any(String));
            expect(article).toHaveProperty("article_id", expect.any(Number));
            expect(article).toHaveProperty("topic", expect.any(String));
            expect(article).toHaveProperty("created_at", expect.any(String));
            expect(article).toHaveProperty("votes", expect.any(Number));
            expect(article).toHaveProperty(
              "article_img_url",
              expect.any(String)
            );
            expect(article).toHaveProperty("comment_count", expect.any(Number));
            expect(article).not.toHaveProperty("body");
          });
        });
    });
    test("200: responds with article data sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("Endpoint has a relevant description in the 'endpoints.json' file", () => {
      return request(app)
        .get("/api")
        .then(({ body: { endpoints } }) => {
          expect(endpoints).toHaveProperty("GET /api/articles");
        });
    });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    test("200: responds with 200 status code and correct comment data for all comments relevant to the given article id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id", expect.any(Number));
            expect(comment).toHaveProperty("votes", expect.any(Number));
            expect(comment).toHaveProperty("created_at", expect.any(String));
            expect(comment).toHaveProperty("author", expect.any(String));
            expect(comment).toHaveProperty("body", expect.any(String));
            expect(comment).toHaveProperty("article_id", expect.any(Number));
          });
        });
    });
    test("200: responds with comment data sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("200: responds with an empty array when an article id is defined by the user that has no comments", () => {
      return request(app)
        .get("/api/articles/13/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toEqual([]);
        });
    });
    test("404: responds with 404 and an error message when a user requests comments for an article that does not exist", () => {
      return request(app)
        .get("/api/articles/10000/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found.");
        });
    });
    test("400: responds with 400 and an error message when the article_id given is invalid", () => {
      return request(app)
        .get("/api/articles/hello/comments")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request.");
        });
    });
    test("Endpoint has a relevant description in the 'endpoints.json' file", () => {
      return request(app)
        .get("/api")
        .then(({ body: { endpoints } }) => {
          expect(endpoints).toHaveProperty(
            "GET /api/articles/:article_id/comments"
          );
        });
    });
  });

  describe("POST /api/articles/:article_id/comments", () => {
    test("201: responds with 201 status code and returns the comment provided by the user", () => {
      const newComment = { username: "rogersop", body: "cool stuff!" };
      return request(app)
        .post("/api/articles/2/comments")
        .send(newComment)
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toHaveProperty("comment_id", 19);
          expect(comment).toHaveProperty("body", "cool stuff!");
          expect(comment).toHaveProperty("article_id", 2);
          expect(comment).toHaveProperty("author", "rogersop");
          expect(comment).toHaveProperty("votes", 0);
          expect(comment).toHaveProperty("created_at", expect.any(String));
        });
    });
    test("201: ignores unneccesarry properties", () => {
      const newComment = {
        username: "rogersop",
        body: "cool stuff!",
        dontAdd: "do not add me!",
      };
      return request(app)
        .post("/api/articles/2/comments")
        .send(newComment)
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toHaveProperty("comment_id", 19);
          expect(comment).toHaveProperty("body", "cool stuff!");
          expect(comment).toHaveProperty("article_id", 2);
          expect(comment).toHaveProperty("author", "rogersop");
          expect(comment).toHaveProperty("votes", 0);
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).not.toHaveProperty("dontAdd");
        });
    });
    test("400: responds with bad request if given no data to post", () => {
      const newComment = {};
      return request(app)
        .post("/api/articles/3/comments")
        .send(newComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request.");
        });
    });
    test("400: responds with bad request if given invalid article id", () => {
      const newComment = {
        username: "rogersop",
        body: "cool stuff!",
      };
      return request(app)
        .post("/api/articles/cheese/comments")
        .send(newComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request.");
        });
    });
    test("404: responds with not found if posting a comment to an article that does not exist", () => {
      const newComment = {
        username: "rogersop",
        body: "This article doesn't exist!",
      };
      return request(app)
        .post("/api/articles/3000/comments")
        .send(newComment)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found.");
        });
    });
  });

  describe("PATCH /api/articles/:article_id", () => {
    test("200: responds with 200 status code and responds with the article provided", () => {
      const patchVote = { inc_votes: 0 };
      return request(app)
        .patch("/api/articles/2")
        .send(patchVote)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toHaveProperty("article_id", 2);
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("body", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
        });
    });
    test("200: updates the votes for the relevant article according to the number of votes given if votes are a positive integer", () => {
      const patchVote = { inc_votes: 2 };
      return request(app)
        .patch("/api/articles/2")
        .send(patchVote)
        .expect(200)
        .then(({ body: { article } }) => {
          const { votes } = article;
          expect(votes).toBe(2);
        });
    });
    test("200: updates the votes for the relevant article according to the number of votes given if votes are a negative integer", () => {
      const patchVote = { inc_votes: -30 };
      return request(app)
        .patch("/api/articles/1")
        .send(patchVote)
        .expect(200)
        .then(({ body: { article } }) => {
          const { votes } = article;
          expect(votes).toBe(70);
        });
    });
    test("200: updates the votes for the relevant article according to the number of votes given and ignores unneccesary properties", () => {
      const patchVote = { inc_votes: 1, breakfast: "croissant" };
      return request(app)
        .patch("/api/articles/1")
        .send(patchVote)
        .expect(200)
        .then(({ body: { article } }) => {
          const { votes } = article;
          expect(votes).toBe(101);
        });
    });
    test("404: returns 404 and not found when given an article id that does not exist", () => {
      const patchVote = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/3000")
        .send(patchVote)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found.");
        });
    });
    test("400: returns 400 and bad request when given an article id that isn't in the correct format", () => {
      const patchVote = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/cheese")
        .send(patchVote)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request.");
        });
    });
    test("400: returns 400 and bad request when patching with an object that contains no data", () => {
      const patchVote = {};
      return request(app)
        .patch("/api/articles/2")
        .send(patchVote)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request.");
        });
    });
  });
  test("400: returns 400 and bad request when inc_votes has a value that is not a number", () => {
    const patchVote = { inc_votes: "hello" };
    return request(app)
      .patch("/api/articles/2")
      .send(patchVote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request.");
      });
  });
  describe("DELETE /api/comments/:comment_id", () => {
    test("204: returns 204 and a blank response", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });
    test("204: comment is deleted from the database", () => {
      return request(app)
        .delete("/api/comments/1")
        .then(() => {
          return db.query("SELECT COUNT(*) FROM comments;").then(({ rows }) => {
            expect(rows[0]["count"]).toEqual("17");
          });
        });
    });
    test("404: responds with 404 when given a comment to delete that does not exist", () => {
      return request(app)
        .delete("/api/comments/1000")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found.");
        });
    });
    test("400: responds with 400 when given a non-integer value for comment_id", () => {
      return request(app)
        .delete("/api/comments/cheese")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request.");
        });
    });
  });

  describe("GET /api/users", () => {
    test("200: returns 200 and an object containing usernames, names and avatar_urls of all users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users.length).toBe(4);
          users.forEach((user) => {
            expect(user).toHaveProperty("username", expect.any(String));
            expect(user).toHaveProperty("name", expect.any(String));
            expect(user).toHaveProperty("avatar_url", expect.any(String));
          });
        });
    });
  });

  describe("GET /api/articles QUERIES", () => {
    describe("GET /api/articles?=topic", () => {
      test("200: returns all articles with relevant topic", () => {
        return request(app)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then(({ body: { articles } }) => {
            articles.forEach((article) => {
              expect(article).toHaveProperty("topic", "cats");
            });
          });
      });
      test("404: responds with 404 when topic given does not exist", () => {
        return request(app)
          .get("/api/articles?topic=cheese")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Not found.");
          });
      });
    });
    describe("GET /api/articles?=sort_by", () => {
      test("200: returns correctly sorted data when given a sort by value", () => {
        return request(app)
          .get("/api/articles?sort_by=article_id")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("article_id", { descending: true });
          });
      });
      test("400: returns 400 when given a sort_by value that is incorrect", () => {
        return request(app)
          .get("/api/articles?sort_by=cheese")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request.");
          });
      });
    });
    describe("GET /api/articles?=order", () => {
      test("200: returns correctly sorted data when given a sort by value", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("created_at", { descending: false });
          });
      });
      test("400: returns 400 when given a sort_by value that is incorrect", () => {
        return request(app)
          .get("/api/articles?order=cheese")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request.");
          });
      });
    });
    describe("GET /api/articles QUERIES chaining", () => {
      test("200: returns correctly sorted data when given an order value and a topic", () => {
        return request(app)
          .get("/api/articles?order=asc&topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("created_at", { descending: false });
            articles.forEach((article) =>
              expect(article).toHaveProperty("topic", "mitch")
            );
          });
      });
      test("200: returns correctly sorted data when given an order,topic and sort_by", () => {
        return request(app)
          .get("/api/articles?order=asc&topic=mitch&sort_by=article_id")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("article_id", { descending: false });
            articles.forEach((article) =>
              expect(article).toHaveProperty("topic", "mitch")
            );
          });
      });
      test("400: returns 400 when given a order value that is incorrect and a topic value that is incorrect", () => {
        return request(app)
          .get("/api/articles?order=cheese&topic=coolstuff")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request.");
          });
      });
    });
  });
});
