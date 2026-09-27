import urlModel from "../../models/url.model.js"
import generateCode from "../../utils/generateCode.js"

export async function createShortenUrl(req,res){
    const {url} = req.body

    if(!url){
        return res.status(400).json({
            error: "Please enter an URL"
        })
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return res.status(400).json({
            error: "Please enter a valid URL"
        })
    }

    if(url.length > 2048){
        return res.status(400).json({
            error: "url is too long"
        })
    }

    const shortCode = generateCode()

    const newUrl = await urlModel.create({
        originalUrl: url,
        shortUrl: shortCode
    })

    return res.status(201).json({
        message: "shorten url created successfully",
        data:{
            originalUrl: newUrl.originalUrl,
            shortUrl: newUrl.shortUrl
        }
    })
}

export async function getAllUrls(req,res) {
    const urls = await urlModel.find()

    return res.status(200).json({
        message: "URLs fetched successfully",
        data:{
            urls
        }
    })
}

export async function getUrlById(req,res) {
    const {id} = req.params

    if(!id){
        return res.status(400).json({
            error: "Enter url Id"
        })
    }

    const url = await urlModel.findById(id)

    if(!url){
        return res.status(400).json({
            error: "No url exists with this Id"
        })
    }

    return res.status(200).json({
        message: "url fetched successfully",
        data:{
            url
        }
    })
}

export async function deleteUrl(req,res) {
    const {id} = req.params

    if(!id){
        return res.status(400).json({
            error: "Please enter an id"
        })
    }

    const url = await urlModel.findById(id)

    if(!url){
        return res.status(400).json({
            error: "No url exists with this id"
        })
    }

    await urlModel.findByIdAndDelete(id)

    return res.status(200).json({
        message: "Url deleted successfully"
    })
}