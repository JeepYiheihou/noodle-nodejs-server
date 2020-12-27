"use strict";

const request = require("supertest");
const assert = require("assert");

const constants = require("../../../src/utils/constants");
const COMMODITY_REQUEST_PREFIX = constants.COMMODITY_REQUEST_PREFIX;

const app = require("../../../src/server");
const tokenUtils = require("../../utils/token_utils");
const getValidToken = tokenUtils.getValidToken;
const dbAutoIncrementResetter = require("../../utils/db_auto_increment_resetter");
const resetCommodityDbAutoIncrement = dbAutoIncrementResetter.resetCommodityDbAutoIncrement;

describe("[test commodity part]", function() {

  describe("test findById API", function() {
    it("test token is needed", function(done) {
      request(app)
        .get(`${COMMODITY_REQUEST_PREFIX}/id/1`)
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

    it("test findById failure on non-existing commodity", function(done) {
      request(app)
        .get(`${COMMODITY_REQUEST_PREFIX}/id/500`)
        .query({ id: 1, token: getValidToken() })
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            assert(res.body.message.includes("Commodity not found."));
            done();
          }
        });
    });

    it("test findById successfully", function(done) {
      request(app)
        .get(`${COMMODITY_REQUEST_PREFIX}/id/1`)
        .query({ id: 1, token: getValidToken() })
        .expect(200)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            assert.strictEqual(res.body.id, 1);
            assert.strictEqual(res.body.name, "Super Highheel");
            done();
          }
        });
    });
  });

  describe("test findByContentId API", function() {
    it("test token is needed", function(done) {
      request(app)
        .get(`${COMMODITY_REQUEST_PREFIX}/find-by-content/1`)
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

    it("test findByContentId on a content with no commodity", function(done) {
      request(app)
        .get(`${COMMODITY_REQUEST_PREFIX}/find-by-content/10086`)
        .query({ id: 1, token: getValidToken() })
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

    it("test findByContentId successfully on a content with commodity", function(done) {
      request(app)
      .get(`${COMMODITY_REQUEST_PREFIX}/find-by-content/1`)
      .query({ id: 1, token: getValidToken() })
      .expect(200)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          assert(res.body.totalHits > 1);
          assert.strictEqual(res.body.hits.length, res.body.totalHits);
          done();
        }
      })
    })
  });

  describe("test update API", function() {
    it("test token is needed", function(done) {
      request(app)
        .put(`${COMMODITY_REQUEST_PREFIX}/id/1`)
        .send({ shoppingUrl: "www.pdd.com" })
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
        .put(`${COMMODITY_REQUEST_PREFIX}/id/10086`)
        .query({ id: 1, token: getValidToken() })
        .send({ shoppingUrl: "www.pdd.com" })
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            assert(res.body.message.includes("Commodity not found."));
            done();
          }
        });
    });

    it("test update successfully", function(done) {
      request(app)
        .put(`${COMMODITY_REQUEST_PREFIX}/id/2`)
        .query({ id: 1, token: getValidToken() })
        .send({ shoppingUrl: "www.pdd.com" })
        .expect(200)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            assert(res.body.message.includes("Commodity successfully updated."));
            done();
          }
        });
    });
  });

  /* All CREATE tests that don't touch real database. */
  describe("test failed create API", function() {
    it("test token is needed", function(done) {
      request(app)
        .post(`${COMMODITY_REQUEST_PREFIX}/create`)
        .send({ name: "Fancy Perfume" })
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
        .post(`${COMMODITY_REQUEST_PREFIX}/create`)
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
        .delete(`${COMMODITY_REQUEST_PREFIX}/id/1`)
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

    it("test delete failure on non-existing commodity id", function(done) {
      request(app)
        .delete(`${COMMODITY_REQUEST_PREFIX}/id/10086`)
        .query({ id: 1, token: getValidToken() })
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            assert(res.body.message.includes("Commodity not found."));
            done();
          }
        });
    });
  });

  /* Because we are doing successful CREATE and DELETE on real database,
   * so we bundle them together to avoid leaving redisue on database. */
  async function test_successful_create_and_delete(done) {
    var commodityId = 0;
    try {
      await request(app)
            .post(`${COMMODITY_REQUEST_PREFIX}/create`)
            .query({ id: 1, token: getValidToken() })
            .send({ name: "Fancy Perfume" })
            .expect(200)
            .expect(function(res) {
              assert(res.body.message.includes("Commodity successfully created."));
              commodityId = res.body.id;
            });

      await request(app)
            .delete(`${COMMODITY_REQUEST_PREFIX}/id/${commodityId}`)
            .query({ id: 1, token: getValidToken() })
            .expect(200)
            .expect(function(res) {
              assert(res.body.message.includes("Commodity successfully deleted."));
            });

      await resetCommodityDbAutoIncrement();
      done()
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
