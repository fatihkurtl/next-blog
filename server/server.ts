import { Request, Response } from 'express';
import cors from 'cors';
import { app, PORT } from './config';
// import { getPosts } from './controllers/postControllers';
import postRoutes from './routes/postRoutes';

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello from Express with TypeScript!' });
});

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions));

const _prefix = '/api';

app.use(`${_prefix}/posts`, postRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

