import express from 'express';
import cors from 'cors';

import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import menuRoutes from './routes/menu.routes.js';
import orderRoutes from './routes/order.routes.js';
import rewardRoutes from './routes/reward.routes.js';
import contactRoutes from './routes/contact.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/contact', contactRoutes);

export default app;
