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

  describe("ALL error handling", () => {
    test("404: responds with 404 when given an endpoint that does not exist", () => {
      return request(app).get("/api/biscoff").expect(404);
    });
  });
});
