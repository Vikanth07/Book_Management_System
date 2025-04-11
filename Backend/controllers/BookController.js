const mongoose = require("mongoose");
const { BookModel } = require("../models/BookModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

let gridfsBucket;

module.exports.initGFS = (conn) => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
  console.log("GridFS initialized...");
};

module.exports.postBooks = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decoded.id;

    const { title } = req.body;
    if (!req.file) return res.status(400).json({ message: "No file" });

    const fileId = new mongoose.Types.ObjectId();
    const uploadStream = gridfsBucket.openUploadStreamWithId(fileId, req.file.originalname);
    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", async () => {
      const book = new BookModel({ title, pdfFile: fileId, userId });
      await book.save();
      res.status(200).json({ message: "Book uploaded", book });
    });

    uploadStream.on("error", (err) => {
      res.status(500).json({ message: "Upload error", error: err.message });
    });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

module.exports.getBooks = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decoded.id;

    const books = await BookModel.find({ userId });
    res.status(200).json({ books });
  } catch (err) {
    res.status(500).json({ message: "Fetch error", error: err.message });
  }
};

module.exports.getBookById = async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const files = await gridfsBucket.find({ _id: fileId }).toArray();

    if (!files.length) return res.status(404).json({ message: "Not found" });

    res.set("Content-Type", "application/pdf");
    gridfsBucket.openDownloadStream(fileId).pipe(res);
  } catch (err) {
    res.status(500).json({ message: "Retrieve error", error: err.message });
  }
};

module.exports.updateBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const updateData = { title };

    if (req.file) {
      const oldBook = await BookModel.findById(id);
      if (oldBook?.pdfFile) {
        const pdfId = oldBook.pdfFile;
        const files = await gridfsBucket.find({ _id: pdfId }).toArray();
        if (files.length > 0) await gridfsBucket.delete(pdfId);
      }

      const newFileId = new mongoose.Types.ObjectId();
      const uploadStream = gridfsBucket.openUploadStreamWithId(newFileId, req.file.originalname);
      uploadStream.end(req.file.buffer);
      updateData.pdfFile = newFileId;
    }

    const book = await BookModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!book) return res.status(404).json({ message: "Not found" });

    res.status(200).json({ message: "Book updated", book });
  } catch (err) {
    res.status(500).json({ message: "Update error", error: err.message });
  }
};

module.exports.deleteBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await BookModel.findByIdAndDelete(id);
    if (!book) return res.status(404).json({ message: "Not found" });

    if (book.pdfFile) {
      const files = await gridfsBucket.find({ _id: book.pdfFile }).toArray();
      if (files.length > 0) await gridfsBucket.delete(book.pdfFile);
    }

    res.status(200).json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete error", error: err.message });
  }
};
