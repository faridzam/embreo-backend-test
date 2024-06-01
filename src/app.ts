import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import * as http from 'http';
import authRoutes from './routes/authRoutes';
import companyRoutes from './routes/companyRoutes';
import eventRoutes from './routes/eventRoutes';

const app: Application = express();

const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/event', eventRoutes);
app.use('/company', companyRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

export { server };

