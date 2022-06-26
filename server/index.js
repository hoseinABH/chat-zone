import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
const app = express();

// Middlewares
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

dotenv.config();

const PORT = process.env.PORT;
const MONGO = process.env.MONGO_URL;
const conntectDB = async () => {
  try {
    await mongoose.connect(MONGO);
    console.log('DB Conntected 🥰');
  } catch (error) {
    console.log(error.message);
  }
};
conntectDB();
app.listen(PORT, () =>
  console.log(`Server is Running on Port ${PORT} 😂😂😂😂`)
);
