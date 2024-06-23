import { useState, useEffect } from 'react'
import Blog from './components/Blog.jsx'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [newTitle, setNewTitle] = useState("")
  const [newAuthor, setNewAuthor] = useState("")
  const [newUrl, setNewUrl] = useState("")


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log("Clicked!")
    
    try {
      const user = await loginService.login({
        username, password,
      })

      blogService.setToken(user.token)

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      ) 

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.error('Login error:', exception) 
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleNewPost = async (event) => {
    event.preventDefault()

    const newBlog = {
      user: user,
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    const auth = user.token
    const saveTitle = newBlog.title
    const saveAuthor = newBlog.author

    blogService
      .create(newBlog)
        .then(blog => {
          setBlogs(blogs.concat(blog))
          setNewAuthor("")
          setNewTitle("")
          setNewUrl("")
          setErrorMessage(
            `a new blog ${saveTitle} by ${saveAuthor} added`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    
      }

  const handleTitleChange = (event) => (
    setNewTitle(event.target.value)
  
  )

  const handleAuthorChange = (event) => (
    setNewAuthor(event.target.value)
  )
  const handleUrlChange = (event) => (
    setNewUrl(event.target.value)
  )

  const newBlogForm = () => (
    <form onSubmit={handleNewPost}>
      <div>title: <input
        value={newTitle}
        onChange={handleTitleChange}
        /></div>
      <div>author: <input
        value={newAuthor}
        onChange={handleAuthorChange}
        /></div>
      <div>url: <input
        value={newUrl}
        onChange={handleUrlChange}
        /></div>
      
        <button type='submit'>save</button>
    </form>
  )

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
  }


  if (user === null) {
    return (
      <div>
        <Notification message={errorMessage} />
        <h2>Log in to application</h2>
        <div>
          {loginForm()}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <div>{user.username} logged in <button id="LObutton" onClick={handleLogout}>logout</button></div>
      <p></p>
      <Notification message={errorMessage} />
      <h2>Create a new blog</h2>
      {newBlogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      
    </div>
  )
}

export default App
