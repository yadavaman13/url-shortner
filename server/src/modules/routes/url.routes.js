import express from "express";
import { createShortenUrl, getAllUrls, getUrlById, deleteUrl, redirectUrl } from "../controllers/url.controller.js";

const urlRouter = express.Router()

urlRouter.post('/', createShortenUrl)

urlRouter.get('/', getAllUrls)

urlRouter.get('/redirect/:shortCode', redirectUrl)

urlRouter.get('/:id', getUrlById)

urlRouter.delete('/:id', deleteUrl)


export default urlRouter