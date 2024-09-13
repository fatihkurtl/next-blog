import express, { Express, Request, Response } from 'express';

const app: Express = express();
const PORT: number = 4001;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express with TypeScript!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});