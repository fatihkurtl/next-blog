import express from 'express';
import { getPosts, createPost } from '../controllers/postControllers';


const router = express.Router();

router.get('/', getPosts);
router.post('/create', createPost);

export default router;