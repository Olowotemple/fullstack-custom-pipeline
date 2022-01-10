describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/test/reset');
    const user1 = {
      name: 'Temple Olowonigba',
      username: 'Olowotemple',
      password: '007',
    };
    cy.request('POST', 'http://localhost:3003/api/users', user1);
    cy.visit('http://localhost:3000');

    const user2 = {
      name: 'Tobi Yusuf',
      username: 'Toby',
      password: '4192',
    };
    cy.request('POST', 'http://localhost:3003/api/users', user2);
    cy.visit('http://localhost:3000');
  });

  it('Login form is shown', function () {
    cy.get('.LoginForm')
      .should('contain', 'Log in to application')
      .and('contain', 'username')
      .and('contain', 'password')
      .and('contain', 'login');
  });

  describe('Login', () => {
    it('succeeds with correct credentials', () => {
      cy.get('#username').type('Olowotemple');
      cy.get('#password').type('007');
      cy.get('#login-button').click();

      cy.get('.Notification')
        .should('contain', 'Welcome Temple')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid');

      cy.contains('Temple Olowonigba logged in');
    });

    it('fails with wrong credentials', () => {
      cy.get('#username').type('Olowotemple');
      cy.get('#password').type('wrong');
      cy.get('#login-button').click();

      cy.get('.Notification')
        .should('contain', 'invalid username or password')
        .should('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid');
    });
  });

  describe('When logged in', function () {
    beforeEach(() => {
      // login user
      cy.get('#username').type('Olowotemple');
      cy.get('#password').type('007');
      cy.get('#login-button').click();

      // create a new blog post
      cy.contains('create new blog').click();
      cy.get('#title').type('How to write tests with Cypress');
      cy.get('#author').type('Catalin Pit');
      cy.get('#url').type('http://fakeurl90362.com');
      cy.get('#create-blog').click();
    });

    it('A blog can be created', () => {
      cy.get('.blogs')
        .should('contain', 'How to write tests with Cypress by Catalin Pit')
        .and('contain', 'show');
    });

    it('a blog can be liked', () => {
      cy.get('#show').click();
      cy.get('#like').click();

      cy.get('.blog__details').contains('1');
    });
  });

  describe('When there are two blog posts', () => {
    beforeEach(() => {
      cy.get('#username').type('Olowotemple');
      cy.get('#password').type('007');
      cy.get('#login-button').click();

      // create a new blog post for user 👆🏾
      cy.contains('create new blog').click();
      cy.get('#title').type('How to write tests with Cypress');
      cy.get('#author').type('Catalin Pit');
      cy.get('#url').type('http://fakeurl90362.com');
      cy.get('#create-blog').click();

      cy.contains('logout').click();

      cy.get('#username').type('Toby');
      cy.get('#password').type('4192');
      cy.get('#login-button').click();

      // create a new blog post for user 👆🏾
      cy.contains('create new blog').click();
      cy.get('#title').type('The Frameworks Battle');
      cy.get('#author').type('Dan Abramov');
      cy.get('#url').type('http://fakeurl787.com');
      cy.get('#create-blog').click();
    });

    it('user who created the blog can delete it', () => {
      cy.contains('How to write tests with Cypress by Catalin Pit');
      cy.contains('The Frameworks Battle by Dan Abramov');

      cy.get('.Blog:first-child').contains('show').click();
      cy.get('.Blog:first-child').should('not.contain', 'remove');

      cy.get('.Blog:nth-child(2)').contains('show').click();

      cy.get('.Blog:nth-child(2)').should('contain', 'remove');
    });

    it.only('blogs are ordered according to likes', () => {
      cy.get('.Blog:nth-child(2)').contains('show').click();
      cy.get('.Blog:nth-child(2)').contains('like').click();

      cy.wait(5000);

      cy.get('.blogs .Blog:first-child').contains(
        'The Frameworks Battle by Dan Abramov'
      );
      cy.get('.Blog:nth-child(2)').contains(
        'How to write tests with Cypress by Catalin Pit'
      );
    });
  });
});
