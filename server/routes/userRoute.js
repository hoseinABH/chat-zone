import express from 'express';
// Controllers
import { getAllUsers } from '../controllers/userControllers';

const router = express.Router();

router.get('/', getAllUsers);
