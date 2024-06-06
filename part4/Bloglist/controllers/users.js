import bcrypt from 'bcrypt'
import express from 'express'
const usersRouter = express.Router()
import User from '../models/user.js'

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate("blogs")
    response.json(users)
  })

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response.status(400).json({ error: 'Username must be unique' });
  } else if (username.length < 3) {
    response.status(400).json({error: "Username is too short"})
  } else if (password.length < 3) {
    response.status(400).json({error: "Password is too short"})
  } else {
    const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
  }

  
})

export default usersRouter
