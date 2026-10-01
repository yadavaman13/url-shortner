import express from 'express';
import {
    createShortenUrl,
    getAllUrls,
    getUrlById,
    deleteUrl,
    redirectUrl,
} from '../controllers/url.controller.js';

const urlRouter = express.Router();

/**
 * @route POST /api/url
 * @description create shorten url for url
 * @access Public
 */
urlRouter.post('/', createShortenUrl);

/**
 * @route GET /api/url
 * @description get all urls
 * @access Public
 */
urlRouter.get('/', getAllUrls);

/**
 * @route GET /api/url/redirect/:shortcode
 * @description redirect to the original url by shortcode
 * @access Public
 */
urlRouter.get('/redirect/:shortCode', redirectUrl);

/**
 * @route GET /api/url/:id
 * @description get url by id or shortcode
 * @access Public
 */
urlRouter.get('/:id', getUrlById);

/**
 * @route DELETE /api/url/:id
 * @description delete url by id or shortcode
 * @access Public
 */
urlRouter.delete('/:id', deleteUrl);

export default urlRouter;
