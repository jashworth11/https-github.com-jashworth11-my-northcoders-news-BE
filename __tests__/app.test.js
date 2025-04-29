const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const app = require("../app");
beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpointsJson);
      });
  });
});
describe("GET /api/topics", () => {
  test("should return all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
            img_url: expect.any(String),
          });
        });
      });
  });
});
describe("non existent routes", () => {
  test("should return 404 for non-existent routes", () => {
    return request(app)
      .get("/api/notAValidUrl")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found!");
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("200: responds with the correct article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("400: responds with error for invalid article_id", () => {
    return request(app)
      .get("/api/articles/notAValidId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request!");
      });
  });
  test("404: responds with error for non-existent article", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found!");
      });
  });
});
describe("GET /api/articles", () => {
  test("200: responds with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(13);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
      });
  });
  test("200: articles are sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an array of comments for the given article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(11);
        body.comments.forEach((comment) => {
          expect(comment).toEqual({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
          expect(comment.article_id).toBe(1);
        });
      });
  });
  test("200: comments are sorted by most recent first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("200: returns empty array if article exists but has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("400: responds with error for invalid article_id", () => {
    return request(app)
      .get("/api/articles/not-a-number/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request!");
      });
  });
  test("404: responds with error for non-existent article", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found!");
      });
  });
});
describe.only("POST /api/articles/:article_id/comments", () => {
  test("201: responds with the posted comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "staffy is the best breed",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: expect.any(Number),
          body: newComment.body,
          article_id: 1,
          author: newComment.username,
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test("400: responds with error for missing fields e.g body", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "test_user" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request!");
      });
  });
  test("400: responds with error for invalid article_id", () => {
    return request(app)
      .post("/api/articles/not-a-number/comments")
      .send({ username: "test_user", body: "Test" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request!");
      });
  });
  test("404: responds with error for non-existent article", () => {
    return request(app)
      .post("/api/articles/9999/comments")
      .send({ username: "test_user", body: "Test" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found!");
      });
  });
  test("400: responds with error for non-existent username", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "notARealUser", body: "Test" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request!");
      });
  });
});
