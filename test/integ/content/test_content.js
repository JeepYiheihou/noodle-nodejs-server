"use strict";

const request = require("supertest");
const assert = require("assert");

const constants = require("../../../src/utils/constants");
const CONTENT_REQUEST_PREFIX = constants.CONTENT_REQUEST_PREFIX;

const app = require("../../../src/server");
const tokenUtils = require("../../utils/token_utils");
const getValidToken = tokenUtils.getValidToken;
const dbAutoIncrementResetter = require("../../utils/db_auto_increment_resetter");
const resetContentDbAutoIncrement = dbAutoIncrementResetter.resetContentDbAutoIncrement;

describe("[test content part]", function() {

  describe("test findById API", function() {
    it("test token is needed", function(done) {
      request(app)
        .get(`${CONTENT_REQUEST_PREFIX}/id/1`)
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            assert(res.body.message.includes("Please provide an id and token."));
            done();
          }
        });
    });

    it("test findById failure on non-existing content", function(done) {
      request(app)
        .get(`${CONTENT_REQUEST_PREFIX}/id/10086`)
        .query({ id: 1, token: getValidToken() })
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            assert(res.body.message.includes("Content not found."));
            done();
          }
        });
    });

    it("test findById successfully", function(done) {
      request(app)
        .get(`${CONTENT_REQUEST_PREFIX}/id/1`)
        .query({ id: 1, token: getValidToken() })
        .expect(200)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            assert.strictEqual(res.body.id, 1);
            assert.strictEqual(res.body.type, "video/mp4");
            done();
          }
        });
    });
  });

  describe("test findAll API", function() {
    it("test token is needed", function(done) {
      request(app)
        .get(`${CONTENT_REQUEST_PREFIX}/find-all`)
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            assert(res.body.message.includes("Please provide an id and token."));
            done();
          }
        });
    });

    it("test findAll successfully", function(done) {
      request(app)
        .get(`${CONTENT_REQUEST_PREFIX}/find-all`)
        .query({ id: 1, token: getValidToken() })
        .expect(200)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            assert(res.body.totalHits > 1);
            assert.strictEqual(res.body.hits.length, res.body.totalHits);
            assert.strictEqual(res.body.hits[0].id, 1);
            done();
          }
        });
    });
  });

  describe("test findByRange API", function(done) {
    it("test token is needed", function(done) {
      request(app)
        .get(`${CONTENT_REQUEST_PREFIX}/find-by-range`)
        .query({ start: 1, end: 200 })
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            assert(res.body.message.includes("Please provide an id and token."));
            done();
          }
        });
    });

    it("test failure on missing start or end params", function(done) {
      request(app)
        .get(`${CONTENT_REQUEST_PREFIX}/find-by-range`)
        .query({ id: 1, token: getValidToken() })
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            assert(res.body.message.includes("Invalid range. Please provide start or end params."));
            done();
          }
        });
    });

    it("test failure on inverted range", function(done) {
      request(app)
        .get(`${CONTENT_REQUEST_PREFIX}/find-by-range`)
        .query({ id: 1, token: getValidToken(), start: 200, end: 1 })
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            assert(res.body.message.includes("Invalid range. Start cannot be larger than end."));
            done();
          }
        });
    });

    it("test on range that does not have content", function(done) {
      request(app)
        .get(`${CONTENT_REQUEST_PREFIX}/find-by-range`)
        .query({ id: 1, token: getValidToken(), start: 10086, end: 10286 })
        .expect(200)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            assert.strictEqual(res.body.totalHits, 0);
            assert.strictEqual(res.body.hits.length, 0);
            done();
          }
        });
    });
  });

  describe("test update API", function() {
    it("test token is needed", function(done) {
      request(app)
        .put(`${CONTENT_REQUEST_PREFIX}/id/1`)
        .send({ length: 256 })
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            assert(res.body.message.includes("Please provide an id and token."));
            done();
          }
        });
    });

    it("test update failure on a non-existing content", function(done) {
      request(app)
        .put(`${CONTENT_REQUEST_PREFIX}/id/10086`)
        .query({ id: 1, token: getValidToken() })
        .send({ length: 256 })
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            assert(res.body.message.includes("Content not found."));
            done();
          }
        });
    });

    it("test udpate successfully", function(done) {
      request(app)
        .put(`${CONTENT_REQUEST_PREFIX}/id/1`)
        .query({ id: 1, token: getValidToken() })
        .send({ length: 256 })
        .expect(200)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            assert(res.body.message.includes("Content successfully updated."));
            done();
          }
        });
    });
  });

  /* All CREATE tests that don't touch real database. */
  describe("test failed create API", function() {
    it("test token is needed", function(done) {
      request(app)
        .post(`${CONTENT_REQUEST_PREFIX}/create`)
        .send({ type: "video/mp4" })
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            assert(res.body.message.includes("Please provide an id and token."));
            done();
          }
        });
    });

    it("test create failure with empty payload", function(done) {
      request(app)
        .post(`${CONTENT_REQUEST_PREFIX}/create`)
        .query({ id: 1, token: getValidToken() })
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            assert(res.body.message.includes("Please provide all required field."));
            done();
          }
        });
    });
  });

  /* All DELETE tests that don't touch real database. */
  describe("test delete API", function() {
    it("test token is needed", function(done) {
      request(app)
        .delete(`${CONTENT_REQUEST_PREFIX}/id/1`)
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            assert(res.body.message.includes("Please provide an id and token."));
            done();
          }
        });
    });

    it("test delete failure on non-existing content id", function(done) {
      request(app)
        .delete(`${CONTENT_REQUEST_PREFIX}/id/10086`)
        .query({ id: 1, token: getValidToken() })
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            assert(res.body.message.includes("Content not found."));
            done();
          }
        });
    });

    it("test delete failure on data of other users", function(done) {
      request(app)
        .delete(`${CONTENT_REQUEST_PREFIX}/id/1`)
        .query({ id: 3, token: getValidToken() })
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            assert(res.body.message.includes("You don't have the authorization to do this."));
            done();
          }
        });
    });
  });

  /* Because we are doing successful CREATE and DELETE on real database,
   * so we bundle them together to avoid leaving redisue on database. */
  async function test_successful_create_and_delete(done) {
    var contentId = 0;
    try {
      await request(app)
            .post(`${CONTENT_REQUEST_PREFIX}/create`)
            .query({ id: 1, token: getValidToken() })
            .send({ type: "video/mp4" })
            .expect(200)
            .expect(function(res) {
              assert(res.body.message.includes("Content successfully created."));
              contentId = res.body.id;
            });

      await request(app)
            .delete(`${CONTENT_REQUEST_PREFIX}/id/${contentId}`)
            .query({ id: 1, token: getValidToken() })
            .expect(200)
            .expect(function(res) {
              assert(res.body.message.includes("Content successfully deleted."));
            });

      await resetContentDbAutoIncrement();
      done();
    } catch(err) {
      done(err);
    }
  }

  describe("test create and delete successfully", function() {
    it("test create and delete successfully", function(done) {
      /* Start from successful create, then successful delete. */
      test_successful_create_and_delete(done);
    });
  });

});
