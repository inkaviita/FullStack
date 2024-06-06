import Blog from "../models/blog.js"


const initialBlogs = [
    {
        "title": "testi",
        "author": "tester",
        "url": "www.testi.fi",
        "likes": 11
      },
      {
        "title": "testi1",
        "author": "tester1",
        "url": "www.test.fi",
        "likes": 400
      },
  ]

  const nonExistingTitle = async () => {
    const blog = new Blog({ title: 'willremovethissoon' })
    await blog.save()
    await blog.deleteOne()
  
    return blog._id.toString()
  }
  
  const postsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(note => note.toJSON())
  }
  
  export default {
    initialBlogs, nonExistingTitle, postsInDb
  }
