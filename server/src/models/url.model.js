import mongoose from "mongoose";

const urlSchema = new mongoose.model({
    originUrl:{
        type: String,
        required:true
    },
    shortUrl:{
        type: String,
        required: true
    },
    clicks: {
        type: Number,
        default: true
    }
},{
    timestamps: true,
})

const urlModel = mongoose.model("urls",urlSchema)

export default urlModel