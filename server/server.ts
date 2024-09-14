import { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';

import { app, PORT } from './config';
// import { getPosts } from './controllers/postControllers';
import postRoutes from './routes/postRoutes';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
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

const _prefix = '/api';

app.use(`${_prefix}/posts`, upload.any(), postRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

