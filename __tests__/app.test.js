const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
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
  describe("GET /api/topics", () => {
    test("200: responds with a status of 200", () => {
      return request(app).get("/api/topics").expect(200);
    });
    test("200: responds with an array of the correct amount of topic objects that have the keys of slug and description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;
          expect(topics).toHaveLength(3);
          topics.forEach((topic) => {
            expect(topic).toHaveProperty("slug", expect.any(String));
            expect(topic).toHaveProperty("description", expect.any(String));
          });
        });
    });
    test("404: responds with 404 when given an endpoint that does not exist", () => {
      return request(app).get("/api/biscoff").expect(404);
    });
  });
});
