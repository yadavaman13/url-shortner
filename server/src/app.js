import express from 'express';
import morgan from 'morgan';
import urlRouter from './modules/url/routes/url.routes.js';
import { redirectUrl } from './modules/url/controllers/url.controller.js';
import { globalLimiter } from './middleware/rateLimit.middleware.js';

const app = express();

app.use(express.json());
app.use(morgan('combined'));
app.use(globalLimiter);

// API routes
app.use('/api/url', urlRouter);

// Root health
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'URL Shortener API is running',
    });
});

// Root-level short code redirection (e.g. http://localhost:3000/:shortCode)
app.get('/:shortCode', redirectUrl);

export default app;
