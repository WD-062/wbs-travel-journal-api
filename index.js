import './db/index.js';
import express from 'express';
import cors from 'cors';
import postsRouter from './routes/postsRouter.js';
import authRouter from './routes/authRouter.js';
import chatRouter from './routes/chatRouter.js';
import adminRouter from './routes/adminRouter.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();
const port = process.env.PORT || 8000;

app.use(cors({ origin: process.env.SPA_ORIGIN, credentials: true }));
app.use(express.json());

app.use('/posts', postsRouter);
app.use('/auth', authRouter);
app.use('/chat', chatRouter);
app.use('/admin', adminRouter);

app.use('*splat', (req, res) => res.status(404).json({ error: 'Not found' }));

app.use(errorHandler);

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
