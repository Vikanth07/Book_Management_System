const mongoose = require("mongoose");
const { BookModel } = require("../models/BookModel");

let gfs;
let gridfsBucket;

module.exports.initGFS = (conn) => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });

  gfs = gridfsBucket;
  console.log("GridFS initialized...");
};

module.exports.postBooks = async (req, res) => {
  try {
    const { title } = req.body;
    const pdfFile = req.file.id;
    const book = new BookModel({ title, pdfFile });
    await book.save();
    res.status(200).json({ message: "Book uploaded successfully", book });
    console.log(req.file);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error uploading book", error: err.message });
  }
};

module.exports.getBooks = async (req, res) => {
  try {
    const books = await BookModel.find();
    res.status(200).json({ message: "Books fetched successfully", books });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching books", error: err.message });
  }
};

module.exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await BookModel.findById(id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json({ message: "Book fetched successfully", book });
  } catch (err) {
    res.status(500).json({ message: "Error getting book", error: err.message });
  }
};

module.exports.updateBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const updateData = { title };

    if (req.file) {
      const oldBook = await BookModel.findById(id);
      if (oldBook?.pdf) {
        const file = await gfs.files.findOne({
          _id: new mongoose.mongo.ObjectId(req.params.id),
        });
        if (file) {
          await gfs.delete(file._id);
        }
      }
      updateData.pdf = req.file.id;
    }

    const book = await BookModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!book) return res.status(404).json({ message: "Book not found" });

    res.status(200).json({ message: "Book updated successfully", book });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating book", error: err.message });
  }
};

module.exports.deleteBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await BookModel.findByIdAndDelete(id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.pdf) {
      const file = await gfs.files.findOne({
        _id: new mongoose.mongo.ObjectId(req.params.id),
      });
      if (file) {
        await gfs.delete(file._id);
      }
    }

    res.status(200).json({ message: "Book deleted successfully", book });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting book", error: err.message });
  }
};
