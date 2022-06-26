import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
const app = express();

// Middlewares
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

dotenv.config();
const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`Server is Running on Port ${PORT} 😂😂😂😂`)
);
