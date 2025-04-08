require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const authRoute = require('./routes/AuthRoute.js');
const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URI;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {
    origin: ['http://localhost:5173'],
    credentials: true,
  }  
));

app.use('/', authRoute);
// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await UserModel.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ success: false, message: "User not found" });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ success: false, message: "Invalid password" });
//     }

//     res.json({ success: true, message: "Login successful", user: { username: user.username, email: user.email } });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ success: false, message: "Something went wrong" });
//   }
// });

// app.post('/signup', async (req, res) => {
//   const { username, email, password } = req.body;
//   try {
//     // Check if user already exists
//     const existingUser = await UserModel.findOne({ email });
//     if (existingUser) {
//       return res.json({ success: false, message: "User already exists." });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Save user
//     const newUser = new UserModel({ username, email, password: hashedPassword });
//     await newUser.save();

//     res.json({ success: true, message: "User registered successfully!" });
//   } catch (error) {
//     console.error("Error during signup:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

app.listen(PORT, () => {
  console.log('Server is running on port 3002');
  mongoose.connect(uri)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));
});