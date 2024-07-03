import { useState } from "react"
//import PropTypes from 'prop-types'

const NewBlogForm = ({user, blogs, setBlogs, setErrorMessage, blogService}) => {

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

        //const createdBlog = await blogService.create(newBlog);
    
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

          
    const [newTitle, setNewTitle] = useState("")
    const [newAuthor, setNewAuthor] = useState("")
    const [newUrl, setNewUrl] = useState("")

    
    const handleTitleChange = (event) => (
    setNewTitle(event.target.value)
    )

    const handleAuthorChange = (event) => (
    setNewAuthor(event.target.value)
    )
    const handleUrlChange = (event) => (
    setNewUrl(event.target.value)
    )

    return(
        <form onSubmit={handleNewPost}>
          <div>title: <input
            id="titleInput"
            value={newTitle}
            onChange={handleTitleChange}
            /></div>
          <div>author: <input
            id="authorInput"
            value={newAuthor}
            onChange={handleAuthorChange}
            /></div>
          <div>url: <input
            id="urlInput"
            value={newUrl}
            onChange={handleUrlChange}
            /></div>
            <button type='submit'>save</button>
        </form>
      )
}

export default NewBlogForm