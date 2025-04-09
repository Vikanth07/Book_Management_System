require("dotenv").config();
const {
  postBooks,
  getBooks,
  getBookById,
  updateBookById,
  deleteBookById,
} = require("../controllers/BookController");
const router = require("express").Router();
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");


const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => ({
    filename: `${Date.now()}-${file.originalname}`,
    bucketName: "uploads",
  })
});

const upload = multer({ storage });

router.post("/api/books", upload.single("pdfFile"), postBooks);
router.get("/api/books", getBooks);
router.get("/api/books/:id", getBookById);
router.delete("/api/books/:id", deleteBookById);
router.put("/api/books/:id", upload.single("pdf"), updateBookById);



module.exports = router;
