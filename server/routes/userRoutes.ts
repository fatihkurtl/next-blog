import express from 'express';
import { saveUser, loginUser } from '../controllers/userControllers';


const router = express.Router();

router.post('/register', saveUser);
router.post('/login', loginUser);

export default router;