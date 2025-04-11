const express = require("express");
const multer = require("multer");
const {
  postBooks,
  getBooks,
  getBookById,
  updateBookById,
  deleteBookById
} = require("../controllers/BookController");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/books", upload.single("pdfFile"), postBooks);
router.get("/books", getBooks);
router.get("/books/:id", getBookById);
router.put("/books/:id", upload.single("pdfFile"), updateBookById);
router.delete("/books/:id", deleteBookById);

module.exports = router;
