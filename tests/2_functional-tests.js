/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  /*test("#example Test GET /api/books", function (done) {
    chai
      .request(server)
      .get("/api/books")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "response should be an array");
        assert.property(
          res.body[0],
          "commentcount",
          "Books in array should contain commentcount"
        );
        assert.property(
          res.body[0],
          "title",
          "Books in array should contain title"
        );
        assert.property(
          res.body[0],
          "_id",
          "Books in array should contain _id"
        );
        done();
      });
  });*/
  /*
   * ----[END of EXAMPLE TEST]----
   */
  let bookId;
  suite("Routing tests", function () {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test("Test POST /api/books with title", function (done) {
          //done();.keepOpen()
          chai
            .request(server)
            .keepOpen()
            .post("/api/books")
            .send({
              title: "post title",
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              bookId = res.body._id;
              assert.deepEqual(res.body.title, "post title");
              assert.deepEqual(res.body._id, bookId);
              done();
            });
        });

        test("Test POST /api/books with no title given", function (done) {
          //done();
          chai
            .request(server)
            .keepOpen()
            .post("/api/books")
            .send({})
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.deepEqual(res.text, "missing required field title");
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        chai
          .request(server)
          .keepOpen()
          .get("/api/books")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response should be an array");
            assert.property(
              res.body[0],
              "commentcount",
              "Books in array should contain commentcount"
            );
            assert.property(
              res.body[0],
              "title",
              "Books in array should contain title"
            );
            assert.property(
              res.body[0],
              "_id",
              "Books in array should contain _id"
            );
            done();
          });
        //done();
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        //done();
        chai
          .request(server)
          .keepOpen()
          .get("/api/books/falseid")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.deepEqual(res.text, "no book exists");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        //done();
        chai
          .request(server)
          .keepOpen()
          .get("/api/books/" + bookId)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, {
              title: "post title",
              _id: bookId,
              comments: [],
            });
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", function (done) {
          //done();
          chai
            .request(server)
            .keepOpen()
            .post("/api/books/" + bookId)
            .send({ comment: "test comment" })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.deepEqual(res.body, {
                title: "post title",
                _id: bookId,
                comments: ["test comment"],
              });
              done();
            });
        });

        test("Test POST /api/books/[id] without comment field", function (done) {
          //done();
          chai
            .request(server)
            .keepOpen()
            .post("/api/books/" + bookId)
            .send({})
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.deepEqual(res.text, "missing required field comment");
              done();
            });
        });

        test("Test POST /api/books/[id] with comment, id not in db", function (done) {
          //done();
          chai
            .request(server)
            .keepOpen()
            .post("/api/books/falseid")
            .send({ comment: "test comment" })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.deepEqual(res.text, "no book exists");
              done();
            });
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object id", function () {
      test("Test DELETE /api/books/[id] with valid id in db", function (done) {
        //done();
        chai
          .request(server)
          .keepOpen()
          .delete("/api/books/" + bookId)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.deepEqual(res.text, "delete successful");
            done();
          });
      });

      test("Test DELETE /api/books/[id] with  id not in db", function (done) {
        //done();
        chai
          .request(server)
          .keepOpen()
          .delete("/api/books/falseid")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.deepEqual(res.text, "no book exists");
            done();
          });
      });
    });
  });
});
