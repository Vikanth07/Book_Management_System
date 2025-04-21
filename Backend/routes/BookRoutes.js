const express = require("express");
const multer = require("multer");
const {
  postBooks,
  getBooks,
  getBookById,
  updateBookById,
  deleteBookById,
  saveProgress,
  getProgress,
  toggleLike,
  testApi,
  saveTotalPages,
  getAllEmails,
  test,
  shareBook,
} = require("../controllers/BookController");


const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { getAccountInfo } = require("../controllers/BookController");
const { updateAccountInfo} = require("../controllers/BookController");

router.post("/books", upload.single("pdfFile"), postBooks);
router.get("/books", getBooks);
router.get("/books/:id", getBookById);
router.put("/books/:id", upload.single("pdfFile"), updateBookById);
router.get("/books/:id/progress", getProgress);
router.post("/books/:id/progress", saveProgress);
router.delete("/books/:id", deleteBookById);
router.patch("/books/:id/like", toggleLike);
router.get("/test",testApi);
router.get("/users/emails",getAllEmails);
router.get("/showrecommendations", test);
router.post("/books/:bookId/share",shareBook);
router.post("/books/:id/total-pages", saveTotalPages);

router.get("/account-info", getAccountInfo);
router.put("/account-info", updateAccountInfo);

module.exports = router;
