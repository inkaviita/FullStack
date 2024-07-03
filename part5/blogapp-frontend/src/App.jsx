import { useState, useEffect } from 'react'
import Blog from './components/Blog.jsx'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import NewBlogForm from './components/fullNewBlogForm.jsx'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [newVisible, setNewVisible] = useState(false)
  const [expandedBlogIds, setExpandedBlogIds] = useState(new Set());

  const fetchBlogs = async () => {
    const blogs = await blogService.getAll()
    setBlogs(blogs.sort((a, b) => b.likes - a.likes))
  }

  useEffect(() => {
    fetchBlogs()
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

  const toggleExpand = (id) => {
    setExpandedBlogIds(prevState => {
      const newSet = new Set(prevState);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };


  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          id='username'
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          id='password'
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id='login-button' type="submit">login</button>
    </form>      
  )

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
  }

  const newForm = () => {
    const hideWhenVisible = { display: newVisible ? 'none' : ''}
    const showWhenVisible = { display: newVisible ? '' : 'none'}

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setNewVisible(true)}>add new</button>
        </div>
        <div style = {showWhenVisible}>
          <NewBlogForm 
            user = {user}
            blogs = {blogs}
            setBlogs = {setBlogs} 
            setErrorMessage = {setErrorMessage} 
            blogService = {blogService} />
          <button onClick={() => setNewVisible(false)}>close</button>
        </div>
      </div>
    )
  }

  const handleDelete = async (id) => {
    const blog = blogs.find(b => b.id === id)
    try {
      if (window.confirm("Do you really want to delete this post?")) {
        await blogService.deleteBlog(id)
        setBlogs(blogs.filter(b => b.id !== id))
      }

    } catch (exception) {
      setErrorMessage("Error deleting blog")
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  }

  const handleLike = async (id) => {
    const blog = blogs.find(b => b.id === id);
    const updatedBlog = { ...blog, likes: blog.likes + 1 };

    try {
      const returnedBlog = await blogService.like(id, updatedBlog);
      setBlogs(blogs.map(b => (b.id === id ? returnedBlog : b)));
    } catch (exception) {
      setErrorMessage('Error updating likes');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };



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
      {newForm()}
        {blogs.map(blog => (
            <Blog
              blog={blog}
              expanded={expandedBlogIds.has(blog.id)}
              toggleExpand={() => toggleExpand(blog.id)}
              like = {handleLike}
              deleteBlog={handleDelete}
              loggedUser = {user}
            />
        ))}
      
    </div>
  )
}

export default App
