import express from 'express';
import {
    createShortenUrl,
    getAllUrls,
    getUrlById,
    deleteUrl,
    redirectUrl,
} from '../controllers/url.controller.js';
import {
    validateCreateUrl,
    validateIdParam,
    validateShortCodeParam,
} from '../../../middleware/validate.middleware.js';
import { createUrlLimiter, redirectLimiter } from '../../../middleware/rateLimit.middleware.js';

const urlRouter = express.Router();

/**
 * @route   POST /api/url
 * @desc    Create a shortened URL
 * @access  Public
 * @rateLimit 10 requests/minute per IP
 */
urlRouter.post('/', createUrlLimiter, validateCreateUrl, createShortenUrl);

/**
 * @route   GET /api/url
 * @desc    Get all shortened URLs
 * @access  Public
 */
urlRouter.get('/', getAllUrls);

/**
 * @route   GET /api/url/redirect/:shortCode
 * @desc    Redirect to the original URL by short code
 * @access  Public
 * @rateLimit 60 requests/minute per IP
 */
urlRouter.get('/redirect/:shortCode', redirectLimiter, validateShortCodeParam, redirectUrl);

/**
 * @route   GET /api/url/:id
 * @desc    Get a single URL by MongoDB ID or short code
 * @access  Public
 */
urlRouter.get('/:id', validateIdParam, getUrlById);

/**
 * @route   DELETE /api/url/:id
 * @desc    Delete a URL by MongoDB ID or short code
 * @access  Public
 */
urlRouter.delete('/:id', validateIdParam, deleteUrl);

export default urlRouter;
