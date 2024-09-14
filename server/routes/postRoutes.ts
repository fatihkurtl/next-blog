import express from 'express';
import { getPosts, getPostById, createPost } from '../controllers/postControllers';


const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/create', createPost);

export default router;