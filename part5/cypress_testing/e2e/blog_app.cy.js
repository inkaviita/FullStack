describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'testays',
      username: 'testitesti',
      password: '12345'
    }

    const user2 = {
      name: "Inksu",
      username: 'InkaV',
      password: '12345'
    }

    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.request('POST', 'http://localhost:3001/api/users/', user2)
    cy.visit('http://localhost:5173')
  })

  it('front page can be opened', function() {
    cy.visit('http://localhost:5173')
    cy.contains('Log in')
  })

  it('login form is shown', function() {
    cy.visit('http://localhost:5173')
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login').click()
  })

  it('user can login', function () {
    cy.contains('login').click()
    cy.get('#username').type('testitesti')
    cy.get('#password').type('12345')
    cy.get('#login-button').click()

    cy.contains('testitesti logged in')
  })  

  describe('when logged in', function() {
    beforeEach(function() {
      cy.contains('login').click()
      cy.get('#username').type('testitesti')
      cy.get('#password').type('12345')
      cy.get('#login-button').click()
    })

    it('a new blog can be created', function() {
      cy.contains('add new').click()
      cy.get('#titleInput').type('a blog created by cypress')
      cy.get('#authorInput').type('a blog created by cypress')
      cy.get('#urlInput').type('a blog created by cypress')
      cy.contains('save').click()
      cy.contains('a blog created by cypress')
    })

    it('blog can be liked', function() {

      cy.contains('add new').click()
      cy.get('#titleInput').type('Testing for likes')
      cy.get('#authorInput').type('Like Author')
      cy.get('#urlInput').type('like.com')
      cy.contains('save').click()

      cy.contains('Testing for likes').parent().as('newBlog')
      cy.get('@newBlog').contains('Show More').click()

      cy.get('@newBlog').contains('likes: 0').should('exist')
      
      cy.get('@newBlog').get('#likeButton').click()
      cy.contains('URL:')
      cy.get('@newBlog').contains('1').should('exist')
    })

    it('User who posted can delete a blog', function() {
      cy.contains('add new').click()
      cy.get('#titleInput').type('Testing for deletion')
      cy.get('#authorInput').type('Deleting Author')
      cy.get('#urlInput').type('delete.com')
      cy.contains('save').click()

      cy.contains('logout').click()

      cy.get('#username').type('testitesti')
      cy.get('#password').type('12345')
      cy.get('#login-button').click()

      cy.contains('Testing for deletion').parent().as('newBlog')

      cy.get('@newBlog').contains('Show More').click()

      cy.get('@newBlog').contains('remove').click()
      cy.contains('Testing for deletion').should('not.exist')
    })

    it('Only creator can see the "remove" button', function() {
      cy.contains('add new').click()
      cy.get('#titleInput').type('Testing for correct user')
      cy.get('#authorInput').type('Correct Author')
      cy.get('#urlInput').type('correct.com')
      cy.contains('save').click()

      cy.contains('logout').click()
      
      // Wait for logout to complete
      cy.contains('login').should('exist')

      cy.get('#username').type('InkaV')
      cy.get('#password').type('12345')
      cy.get('#login-button').click()

      cy.contains('InkaV logged in')  // Make this assertion specific to the logged-in user

      cy.contains('Testing for correct user').parent().as('newBlog1')

      

      cy.get('@newBlog1').contains('Show More').click()

      cy.get('@newBlog1').contains('remove').should('not.exist')
    })
  })
})
