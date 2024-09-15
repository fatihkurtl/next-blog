import express from 'express';
import { saveUser } from '../controllers/userControllers';


const router = express.Router();

router.post('/register', saveUser);


export default router;