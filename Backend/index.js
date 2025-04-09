require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/AuthRoute.js');
const bookRoute = require('./routes/BookRoutes.js'); 
const {initGFS}  = require('./controllers/BookController.js')
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
app.use('/', bookRoute);

mongoose.connect(uri);

const conn = mongoose.connection;
conn.once('open', () => {
  console.log('MongoDB connected...');
  initGFS(conn); 
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});