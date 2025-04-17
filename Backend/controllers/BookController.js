const mongoose = require("mongoose");
const { BookModel } = require("../models/BookModel");
const { UserModel } = require("../models/UserModel");
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

    const { author } = req.body;
    if (!author) return res.status(400).json({ message: "No author" });

    const fileId = new mongoose.Types.ObjectId();
    const uploadStream = gridfsBucket.openUploadStreamWithId(
      fileId,
      req.file.originalname
    );
    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", async () => {
      const book = new BookModel({ title, author, pdfFile: fileId, userId });
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

    if (!files.length) return res.status(404).json({ message: "Book Not found" });

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
      const uploadStream = gridfsBucket.openUploadStreamWithId(
        newFileId,
        req.file.originalname
      );
      uploadStream.end(req.file.buffer);
      updateData.pdfFile = newFileId;
    }

    const book = await BookModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
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

module.exports.saveProgress = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decoded.id;
    const { id } = req.params;
    const { progress } = req.body;
    const {totalPages} = req.body;

    if (typeof progress !== "number") {
      return res.status(400).json({ message: "Progress must be a number" });
    }

    const book = await BookModel.findOneAndUpdate(
      { _id: id, userId },
      { progress , totalPages},
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ message: "Book not found for this user" });
    }

    res
      .status(200)
      .json({ message: "Progress saved", progress: book.progress, totalPages: book.totalPages });
  } catch (err) {
    console.error("Save progress error:", err.message);
    res
      .status(500)
      .json({ message: "Failed to save progress", error: err.message });
  }
};

module.exports.getProgress = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decoded.id;

    const book = await BookModel.findOne({ userId });
    if (!book) {
      return res.status(404).json({ message: "Book not found for this user" });
    }

    res.status(200).json({ progress: book.progress , totalPages: book.totalPages });
  } catch (err) {
    console.error("Get progress error:", err.message);
    res
      .status(500)
      .json({ message: "Failed to get progress", error: err.message });
  }
};

module.exports.saveTotalPages = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decoded.id;

    const { totalPages } = req.body;

    const book = await BookModel.findOneAndUpdate(
      { userId: userId },
      { totalPages },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Total pages saved" });
  } catch (err) {
    res.status(500).json({ message: "Error saving total pages", error: err.message });
  }
};


module.exports.toggleLike = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decoded.id;
    const book = await BookModel.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    book.isLiked = !book.isLiked;
    await book.save();

    res.status(200).json({ isLiked: book.isLiked });
  } catch (err) {
    console.error("Toggle like error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.testApi = async(req, res)=>{
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decoded.id;

    const likedBooks = await BookModel.find({
      userId: userId,
      isLiked: true,
    });

    res.status(200).json(likedBooks);
  } catch (err) {
    console.error("Get liked books error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports.getAllEmails = async(req, res)=>{
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decoded.id;
    if (!userId) return res.status(401).json({ message: "Invalid token" });

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const allUsers = await UserModel.find({ _id: { $ne: userId } });
    const emails = allUsers.map((user) => user.email);

    res.status(200).json(emails);
  } catch (err) {
    console.error("Get emails error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

module.exports.shareBook = async (req, res) => {
  const { bookId } = req.params;
  const { email } = req.body;

  try {
    console.log("Sharing book:", bookId, "to email:", email);

    const userToShare = await UserModel.findOne({ email });
    if (!userToShare) {
      console.log("User not found with email:", email);
      return res.status(404).json({ message: 'User not found.' });
    }

    const book = await BookModel.findById(bookId);
    if (!book) {
      console.log("Book not found with ID:", bookId);
      return res.status(404).json({ message: 'Book not found.' });
    }

    if (!Array.isArray(book.sharedWith)) {
      console.log("sharedWith field is not initialized. Initializing...");
      book.sharedWith = [];
    }

    if (!book.sharedWith.includes(userToShare._id)) {
      book.sharedWith.push(userToShare._id);
      await book.save();
      console.log(`Book shared with ${email}`);
    }

    res.json({ message: `Book shared with ${email}.` });
  } catch (err) {
    console.error("Error sharing book:", err);
    res.status(500).json({ message: 'Failed to share book.', error: err.message });
  }
};

module.exports.test = async (req, res) => {
  console.log("Fetching recommendations...");
  try {
    const token = req.cookies.token;
    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    if (!decoded || !decoded.id) {
      console.log("Invalid token or no user ID in token");
      return res.status(401).json({ message: "Invalid token" });
    }
    
    const userId = decoded.id;
    console.log("User ID decoded from token:", userId);

    const books = await BookModel.find({ sharedWith: userId }).populate("owner", "email");
    console.log("Books fetched:", books);

    res.status(200).json(books);
  } catch (err) {
    console.error("Error fetching recommendations:", err);
    res.status(500).json({ message: "Failed to fetch recommendations", error: err.message });
  }
}