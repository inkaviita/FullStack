import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 100
    },

    author: {
        type: String,
        required: true,
        maxlength: 100
    },

    url: {
        type: String,
        required: false,
        maxlength: 100
    },

    likes: {
        type: Number,
        required: false,
    }
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject._id
        delete returnedObject.__v
    }
})

export default mongoose.model("Blog", blogSchema)
