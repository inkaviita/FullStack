import express from "express"
const blogsRouter = express.Router()

import jwt from 'jsonwebtoken'

import blog from "../models/blog.js"
const Blog = blog

import User from '../models/user.js'

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    return null
  }

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1})
    response.json(blogs)
})

blogsRouter.get('/:title', async (request, response) => {
        const blog = await Blog.findOne({ title: request.params.title });
        if (blog) {
            response.json(blog);
        } else {
            response.status(404).end();
        }
});


blogsRouter.post('/', async (request, response) => {
    const body = request.body

    if (!(body.title) || !(body.url)) {
        response.status(400).json({error: "Title or URL is missing"})
    }

    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
  
    const bl = new Blog({
      title: body.title, 
      author: body.author,
      url: body.url,
      likes: (body.likes) ? body.likes : 0,
      user: {username: user.username,
        name: user.name,
        id: user.id
      }
    })

    const savedBlog = await bl.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:title', async (request, response) => {

    const user = request.user

    const blogToDelete = await Blog.findOne({ title: request.params.title });

    if (!blogToDelete) {
        response.status(404).json({error: "Blog not found"})
    } else if (blogToDelete.user.toString() === user._id.toString()) {
        await Blog.findOneAndDelete({ title: request.params.title });
        response.status(204).end();
    } else {
        response.status(404).json({ error: 'Only creator can delete' });
    }
    
});

blogsRouter.put('/:id', (request, response) => {
    const body = request.body
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }
  
    Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
      .then(updatedBlog => {
        response.json(updatedBlog)
      })
  })
  

export default blogsRouter
