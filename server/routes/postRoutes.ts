import express from 'express';
import { getPosts } from '../controllers/postControllers';


const router = express.Router();

router.get('/', getPosts);

export default router;