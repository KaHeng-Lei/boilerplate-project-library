/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
const { CommentModel } = require("../models.js");

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        CommentModel.find({}, (err, books) => {
          if (!books) {
            res.send([]);
          } else {
            const formatData = books.map((book) => {
              return {
                _id: book._id,
                comments: book.comments,
                title: book.title,
                commentcount: book.comments.length,
              };
            });
            console.log(res.body);
            res.json(formatData);
          }
        });
      } catch (err) {
        console.error(err);
      }
    })

    .post(async function (req, res) {
      let title = req.body.title;
      if (!title) {
        res.send("missing required field title");
        return;
      }
      //response will contain new book object including atleast _id and title
      const newBook = new CommentModel({ title: title, comments: [] });
      await newBook.save((err, savedData) => {
        if (err || !savedData) {
          res.send("there was an error saving");
        } else {
          res.json({
            _id: savedData._id,
            title: savedData.title,
          });
        }
      });
    })

    .delete(async function (req, res) {
      //if successful response will be 'complete delete successful'
      await CommentModel.deleteMany({})
        .then(function () {
          console.log("complete delete successful"); // Success
          res.send("complete delete successful");
        })
        .catch(function (error) {
          console.log(error); // Failure
        });
    });

  app
    .route("/api/books/:id")
    .get(async function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        await CommentModel.findById(bookid).exec((err, doc) => {
          if (!doc) {
            res.send("no book exists");
          } else {
            res.json({
              comments: doc.comments || [],
              _id: doc._id,
              title: doc.title,
              commentcount: doc.comments.length,
            });
          }
        });
      } catch (err) {
        console.log(err);
      }
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      try {
        if (!comment) {
          res.send("missing required field comment");
          return;
        }
        await CommentModel.findById(bookid).exec(async (err, book) => {
          if (!book) {
            res.send("no book exists");
          } else {
            book.comments.push(comment);
            await book.save((err, savedData) => {
              res.json({
                comments: savedData.comments,
                _id: savedData._id,
                title: savedData.title,
                commentcount: savedData.comments.length,
              });
            });
          }
        });
      } catch (err) {
        console.log(err);
      }
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      CommentModel.findByIdAndRemove({ _id: bookid }, (err, data) => {
        if (err || !data) {
          res.send("no book exists");
        } else {
          res.send("delete successful");
        }
      });
    });
};
