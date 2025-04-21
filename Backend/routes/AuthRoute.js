const express = require("express");
const router = express.Router();

const { Signup, Login, verifyOTP, forgotPassword, resetPassword } = require("../controllers/AuthController");
const { userVerification } = require('../middlewares/AuthMiddleware');

router.post("/", userVerification);


router.post("/signup", Signup);
router.post("/login", Login);
router.post("/verify-otp", verifyOTP);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);



module.exports = router;