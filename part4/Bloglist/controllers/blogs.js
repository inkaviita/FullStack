import express from "express"
const blogsRouter = express.Router()

import blog from "../models/blog.js"
const Blog = blog

blogsRouter.get('/', (request, response) => {
    Blog.find({}).then(blogs => {
        response.json(blogs)
    })
})

blogsRouter.get('/:title', (request, response, next) => {
    Blog.findByTitle(request.params.title)
        .then(blog => {
            if (blog) {
                response.json(blog)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

blogsRouter.post('/', (request, response, next) => {
    const body = request.body
  
    const blog = new Blog({
      title: body.title, 
      author: body.author,
      url: body.url,
      likes: body.likes
    })
  
    blog.save()
      .then(savedNote => {
        response.json(savedNote)
      })
      .catch(error => next(error))
  })

  
 export default blogsRouter
