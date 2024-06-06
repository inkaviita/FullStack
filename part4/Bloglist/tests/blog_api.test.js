import { test, after, beforeEach, describe} from 'node:test'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app.js'
import assert from 'node:assert'
import bcrypt from 'bcrypt'
import User from '../models/user.js'
//import { response } from 'express'
//import helper from '../utils/list_helper.js'

import blog from "../models/blog.js"
const Blog = blog

const api = supertest(app)



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

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})


test('Blog list application returns blog posts in the JSON format', async () => {
    await api
    .get('/api/posts')
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const res = await api.get('/api/posts')
  assert.strictEqual(res.body.length, initialBlogs.length)
})

test('Blog list application names unique identifier correctly', async () => {
  const response = await api.get('/api/posts')
  //expect(response.body[0].id).toBeDefined
  let isDef = 0
  if (response.body[0].id) {
    isDef = 1
  }
  assert.strictEqual(isDef, 1)
});


test('post request works', async() => {

    const blogToBeAdded = {
        title: "Testi",
        author: "mina",
        url: "www.inksu.fi",
        likes: 69
    }

    await api
      .post('/api/posts')
      .send(blogToBeAdded)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const all = await api.get('/api/posts')

    const onlyNames = all.body.map(post => post.title)
    assert.strictEqual(all.body.length, initialBlogs.length + 1)
    assert.strictEqual(onlyNames.includes("testi"), true)

})

test('likes default to 0 if not defined', async() => {

  const blogToBeAdded = {
    title: "Testi",
    author: "mina",
    url: "www.inksu.fi"
  }

  await api
    .post('/api/posts')
    .send(blogToBeAdded)
    .expect(201)
    .expect("Content-Type", /application\/json/)

  const all = await api.get('/api/posts')

  const titleWithLikes = all.body.map(post => [post.title, post.likes])
  
  const added = titleWithLikes[titleWithLikes.length - 1][1]

  assert.strictEqual(added, 0)
})

test("Backend responds with 400 Bad Request if URL is missing", async() => {
  const blogToBeAdded = {
    title: "Testi",
    author: "mina",
    likes: 12
  }

  await api
    .post('/api/posts')
    .send(blogToBeAdded)
    .expect(400)
})

test("Backend responds with 400 Bad Request if title is missing", async() => {
  const blogToBeAdded = {
    author: "mina",
    url: "test.com",
    likes: 12
  }

  await api
    .post('/api/posts')
    .send(blogToBeAdded)
    .expect(400)
})

test("A post can be deleted", async () => {
  const b = await blogsInDB()
  const blogToDelete = b[0]

  await api
    .delete(`/api/posts/${blogToDelete.title}`)
    .expect(204)
  
  const all = await api.get('/api/posts')
  assert.strictEqual(all.body.length, initialBlogs.length - 1)

})

test("A post can be updated", async () => {
  const b = await blogsInDB()
  const blogToEdit = b[0]

  const updated = {
    "title": "Here is the new blog",
    "author": "new Author",
    "url": "new.com",
    "likes": 1234567
  }

  await api
    .put(`/api/posts/${blogToEdit.id}`)
    .send(updated)
    .expect(200)
  
  const response = await api.get(`/api/posts`)

  const onlyNames = response.body.map(x => x.title)

  assert.strictEqual(response.body.length, initialBlogs.length)
  assert.strictEqual(onlyNames.includes("Here is the new blog"), true)
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
})

after(async () => {
  await mongoose.connection.close()
})
