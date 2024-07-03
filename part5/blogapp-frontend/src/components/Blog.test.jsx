import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog.jsx'
import { expect } from 'vitest'
import NewBlogForm from './fullNewBlogForm.jsx'

test('renders title and author by default', () => {
  const blog = {
    title: 'This is a test',
    author: 'This is a test too',
    url: 'this is the url',
    likes: 24,
    user: {
        username: "testUser"
    }
  }

  const loggedUser = { username: 'testUser' }
  const handleBlogDelete = () => null
  const handleLike = () => null
  const like = () => null

  const component = render(
    <Blog
      blog={blog}
      loggedUser={loggedUser}
      handleBlogDelete={handleBlogDelete}
      handleLike={handleLike}
      expanded={false}
      like={like}
    />
  )

  screen.debug()
  
  expect(component.container).toHaveTextContent('This is a test')

  expect(component.container).toHaveTextContent('This is a test too')

  expect(component.container).not.toHaveTextContent("this is the url")

  expect(component.container).not.toHaveTextContent(24)
})


test('URL and likes are shown when view/hide button is clicked', async () => {
    const blog = {
        title: 'This is a test',
        author: 'This is a test too',
        url: 'this is the url',
        likes: 24,
        user: {
            username: "testUser"
        }
      }
    const mockHandler = vi.fn()

    const loggedUser = { username: 'testUser' }
    const handleBlogDelete = vi.fn()
    const handleLike = vi.fn()
    const toggleExpand = vi.fn()

    const { rerender } = render(
        <Blog
          blog={blog}
          loggedUser={loggedUser}
          handleBlogDelete={handleBlogDelete}
          handleLike={handleLike}
          expanded={false}
          toggleExpand={toggleExpand}
        />
      )
  
    const user = userEvent.setup()
    const button = screen.getByText('Show More')
    //await user.click(button)

    rerender(
        <Blog
          blog={blog}
          loggedUser={loggedUser}
          deleteBlog={handleBlogDelete}
          like={handleLike}
          expanded={true}
          toggleExpand={toggleExpand}
        />
      )

    screen.debug()

    expect(screen.getByText('URL: this is the url')).toBeInTheDocument()
    expect(screen.getByText('likes: 24')).toBeInTheDocument()
  })

  test('if like is clicked twice, the event handler is called twice', async () => {

    const blog = {
        title: 'This is a test',
        author: 'This is a test too',
        url: 'this is the url',
        likes: 24,
        user: {
            username: "testUser"
        }
      }
    
    const mockHandler = vi.fn()
    
      const loggedUser = { username: 'testUser' }
      const handleBlogDelete = () => null
      const handleLike = () => null
    
      const component = render(
        <Blog
          blog={blog}
          loggedUser={loggedUser}
          handleBlogDelete={handleBlogDelete}
          handleLike={handleLike}
          expanded={true}
          like={mockHandler}
        />
      )

    const user = userEvent.setup()

    const button = screen.getByText('like')

    await user.click(button)
    await user.click(button)

    screen.debug()

    expect(mockHandler.mock.calls).toHaveLength(2)
  })

  test("Form calls the event handler as props", () => {
    const handleNewPost = vi.fn()

    
  })
