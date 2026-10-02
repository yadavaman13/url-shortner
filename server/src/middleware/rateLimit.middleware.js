import rateLimit from 'express-rate-limit';

/**
 * Global limiter — applied to all routes.
 * 200 requests per 15-minute window per IP.
 */
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: 'draft-7', // Return rate-limit info in RateLimit-* headers
    legacyHeaders: false,
    message: {
        error: 'Too many requests, please try again later.',
    },
});

/**
 * Strict limiter for URL creation endpoint.
 * 10 requests per 1-minute window per IP.
 */
export const createUrlLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        error: 'Too many URL creation requests. Please wait a minute before trying again.',
    },
});

/**
 * Redirect limiter — protects high-frequency redirect endpoints.
 * 60 requests per 1-minute window per IP.
 */
export const redirectLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        error: 'Too many redirect requests. Please slow down.',
    },
});
