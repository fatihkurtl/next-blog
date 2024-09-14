import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import { app, PORT } from './config';
// import { getPosts } from './controllers/postControllers';
import postRoutes from './routes/postRoutes';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    fieldSize: 5 * 1024 * 1024,
  },
});

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello from Express with TypeScript!' });
});

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join('uploads')));
const _prefix = '/api';

app.use(`${_prefix}/posts`, upload.single('image'), postRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

