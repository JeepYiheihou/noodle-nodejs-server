"use strict";

const request = require("supertest");
const assert = require("assert");

const constants = require("../../../src/utils/constants");
const USER_REQUEST_PREFIX = constants.USER_REQUEST_PREFIX;

const app = require("../../../src/server");
const tokenUtils = require("../../utils/token_utils");
const getValidToken = tokenUtils.getValidToken;
const dbAutoIncrementResetter = require("../../utils/db_auto_increment_resetter");
const resetUserDbAutoIncrement = dbAutoIncrementResetter.resetUserDbAutoIncrement;

describe("[test user part]", function() {

  describe("test login API", function() {
    it("test login successfully", function(done) {
      request(app)
        .post(`${USER_REQUEST_PREFIX}/login`)
        .send({ name: "admin", password: "admin" })
        .expect(200)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            assert.strictEqual(res.body.name, "admin");
            assert.strictEqual(res.body.password, "admin");
            assert.strictEqual(res.body.gender, "male");
            done();
          }
        });
    });

    it("test login failed with wrong password", function(done) {
      request(app)
        .post(`${USER_REQUEST_PREFIX}/login`)
        .send({ name: "admin", password: "let'sdance!" })
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            assert(res.body.message.includes("Invalid user or password."));
            done();
          }
        });
    });
  });

  describe("test findById API", function() {
    it("test token is needed", function(done) {
      request(app)
        .get(`${USER_REQUEST_PREFIX}/id/1`)
        .expect(400)
        .end(function(err, res) {
          if(err) {
            done(err)
          } else {
            assert(res.body.message.includes("Please provide an id and token."));
            done();
          }
        });
    });

    it("test findById failure on non-existing user", function(done) {
      request(app)
        .get(`${USER_REQUEST_PREFIX}/id/10`)
        .query({ id: 1, token: getValidToken() })
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err)
          } else {
            assert(res.body.message.includes("User not found."));
            done();
          }
        });
    });

    it("test findById successfully", function(done) {
      request(app)
        .get(`${USER_REQUEST_PREFIX}/id/1`)
        .query({ id: 1, token: getValidToken() })
        .expect(200)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            assert.strictEqual(res.body.name, "admin");
            assert.strictEqual(res.body.password, "admin");
            assert.strictEqual(res.body.gender, "male");
            done();
          }
        });
    });
  });

  describe("test findAll API", function() {
    it("test token is needed", function(done) {
      request(app)
        .get(`${USER_REQUEST_PREFIX}/find-all`)
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
        .get(`${USER_REQUEST_PREFIX}/find-all`)
        .query({ id: 1, token: getValidToken() })
        .expect(200)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            assert(res.body.totalHits > 1);
            assert.strictEqual(res.body.hits.length, res.body.totalHits);
            assert.strictEqual(res.body.hits[0].name, "admin");
            done();
          }
        });
    });
  });

  describe("test update API", function() {
    it("test token is needed", function(done) {
      request(app)
        .put(`${USER_REQUEST_PREFIX}/id/2`)
        .query({ id: 2 })
        .send({ name: "testName" })
        .expect(400)
        .end(function(err, res) {
          if(err) {
            done(err)
          } else {
            assert(res.body.message.includes("Please provide an id and token."));
            done();
          }
        });
    });

    it("test update failure on data of other users", function(done) {
      request(app)
        .put(`${USER_REQUEST_PREFIX}/id/2`)
        .query({ id: 1, token: getValidToken() })
        .send({ name: "testName" })
        .expect(400)
        .end(function(err, res) {
          if(err) {
            done(err)
          } else {
            assert(res.body.message.includes("You don't have the authorization to do this."))
            done();
          }
        });
    });

    it("test update failure on a non-existing user id", function(done) {
      request(app)
        .put(`${USER_REQUEST_PREFIX}/id/10`)
        .query({ id: 10, token: getValidToken() })
        .send({ name: "testName" })
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err)
          } else {
            assert(res.body.message.includes("User not found."))
            done();
          }
        });
    });

    it("test update successfully", function(done) {
      request(app)
        .put(`${USER_REQUEST_PREFIX}/id/2`)
        .query({ id:2, token: getValidToken() })
        .send({ name: "testName" })
        .expect(200)
        .end(function(err, res) {
          if(err) {
            done(err)
          } else {
            assert(res.body.message.includes("User successfully updated."));
            done();
          }
        });
    });
  });

  /* All CREATE tests that don't touch real database. */
  describe("test failed create API", function() {
    it("test create failure with empty payload", function(done) {
      request(app)
        .post(`${USER_REQUEST_PREFIX}/create`)
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

    it("test create failure with already existing email", function(done) {
      request(app)
        .post(`${USER_REQUEST_PREFIX}/create`)
        .send({ name: "newName", email: "existing@email.com" })
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            assert(res.body.message.includes("User already existed with this email."));
            done();
          }
        });
    });
  });

  /* All DELETE tests that don't touch real database. */
  describe("test failed delete API", function() {
    it("test token is needed", function(done) {
      request(app)
        .delete(`${USER_REQUEST_PREFIX}/id/2`)
        .query({ id: 2 })
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

    it("test delete failure on data of other users", function(done) {
      request(app)
        .delete(`${USER_REQUEST_PREFIX}/id/2`)
        .query({ id: 1 })
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            assert(res.body.message.includes("You don't have the authorization to do this."));
            done();
          }
        })
    });

    it("test delete failure on non-existing user id", function(done) {
      request(app)
        .delete(`${USER_REQUEST_PREFIX}/id/10`)
        .query({ id: 10, token: getValidToken() })
        .expect(400)
        .end(function(err, res) {
          if(err) {
            done(err);
          } else {
            assert(res.body.message.includes("User not found."));
            done();
          }
        });
    });
  });

  /* Because we are doing successful CREATE and DELETE on real database,
   * so we bundle them together to avoid leaving redisue on database. */
  async function test_successful_create_and_delete(done) {
    var userId = 0;
    try {
      await request(app)
            .post(`${USER_REQUEST_PREFIX}/create`)
            .send({ name: "newName", email: "new@email.com" })
            .expect(200)
            .expect(function(res) {
              assert(res.body.message.includes("User successfully created."));
              userId = res.body.id;
            });

      await request(app)
            .delete(`${USER_REQUEST_PREFIX}/id/${userId}`)
            .query({ id: userId, token: getValidToken() })
            .expect(200)
            .expect(function(res) {
              assert(res.body.message.includes("User successfully deleted."));
            });

      await resetUserDbAutoIncrement();
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
