import express from "express";
import { createShortenUrl, getAllUrls, getUrlById, deleteUrl } from "../controllers/url.controller.js";

const urlRouter = express.Router()

urlRouter.post('/', createShortenUrl)

urlRouter.get('/', getAllUrls)

urlRouter.get('/:id', getUrlById)

urlRouter.delete('/:id', deleteUrl)


export default urlRouter