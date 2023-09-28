/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
const mongoose = require("mongoose");

module.exports = function (app) {
  mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const Schema = mongoose.Schema;
  const booksSchema = new Schema({
    title: { type: String, required: true },
    comments: [String],
  });
  booksSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.__v;
    return obj;
  };
  const Book = mongoose.model("Book", booksSchema);

  app
    .route("/api/books")
    .get(async function (req, res) {
      try {
        let data = [];
        let book = {};
        let books = await Book.find();
        books.forEach((e) => {
          book["_id"] = e._id;
          book["title"] = e.title;
          book["commentcount"] = e.comments.length;
          data.push(book);
        });
        res.json(data);
      } catch (error) {
        res.json({ error: "problem searching database" });
      }
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(async function (req, res) {
      try {
        let title = req.body.title;
        if (!title) {
          return res.type("text").send("missing required field title");
        }
        let newBook = new Book({ title: title });
        let check = await newBook.save();
        let book = await Book.findOne({ _id: check._id });
        res.json({ _id: book._id, title: book.title });
      } catch (error) {
        res.json({ error: "problem searching database" });
      }
      //response will contain new book object including atleast _id and title
    })

    .delete(async function (req, res) {
      try {
        let bookDeleted = await Book.deleteMany({});
        res.type("text").send("complete delete successful");
      } catch (error) {
        res.json({ error: "problem searching database" });
      }
      //if successful response will be 'complete delete successful'
    });

  app
    .route("/api/books/:id")
    .get(async function (req, res) {
      try {
        let bookid = req.params.id;
        let book = await Book.findById(bookid);
        if (book) {
          res.json(book);
        } else {
          res.type("text").send("no book exists");
        }
      } catch (error) {
        res.type("text").send("no book exists");
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(async function (req, res) {
      try {
        let bookid = req.params.id;
        let comment = req.body.comment;
        if (!comment) {
          return res.type("text").send("missing required field comment");
        }
        let book = await Book.findById(bookid);
        if (book) {
          book.comments.push(comment);
          await book.save();
          res.json(book);
        } else {
          res.type("text").send("no book exists");
        }
      } catch (error) {
        res.type("text").send("no book exists");
      }
      //json res format same as .get
    })

    .delete(async function (req, res) {
      try {
        let bookid = req.params.id;

        let bookDeleted = await Book.findByIdAndRemove(bookid);
        if (bookDeleted) {
          res.type("text").send("delete successful");
        } else {
          res.type("text").send("no book exists");
        }
      } catch (error) {
        res.type("text").send("no book exists");
      }
      //if successful response will be 'delete successful'
    });
};
