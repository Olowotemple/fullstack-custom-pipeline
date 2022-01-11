# FullStack-Custom-Pipeline

[![Deployment pipeline](https://github.com/Olowotemple/fullstack-custom-pipeline/actions/workflows/pipeline.yml/badge.svg)](https://github.com/Olowotemple/fullstack-custom-pipeline/actions/workflows/pipeline.yml)

This project completes exercises 11.21/11.22 from fullstakopen. The projects aims to build a CI/CD-pipeline for a previously built application (for which I chose the bloglist app built earlier).

The server code is located at the root of the project and the `client/` within root contains the client-side code.

The backend is RESTFUL and is built with Expressjs; communicates with a MongoDB server with mongoose as the chosen ODM. Here is a brief summary of the endpoints:

---

- /api/blogs

  - /
    - **GET** - Returns a list of all blogs from storage.
    - **POST** - Persists blog to storage (requires authentication).

  ***

  - /:id

    - **DELETE** - Removes blog created by authenticated user from storage (requires authentication).

    - **PUT** - Updates blog details for that particular `id`.

    ***

    - /comments
      - **POST** - Adds comment to blog of particular id.

  ***

- /api/login

  - /
    - **POST**
      - Requires username and password.
      - Returns a signed token if credentials are correct, else throws an error.

  ***

- /api/users

  - /
    - **GET** - Returns a list of all the users in storage.
    - **POST**
      - Requires username and password.
      - Returns a signed token if credentials validate correctly.

---

## Misc routes

- /api/test `(Available only when NODE_ENV === 'test')`

  - /reset
    - **POST** - Used during the setup phase by Cypress in e2e tests. It Deletes all users and blogs from storage used specifically for testing purposes.

---

- /health

  - **GET**

    - This route is used by the workflow file

      - pipeline.yml: to determine if the just deployed service is up and running and if not can rollback to a previously running release.

      - scheduled_healthcheck.yml: to determine if the service is up and running and is run periodically (in our case, it runs at 12:45 on day-of-month 11 and on Wednesday).

---

The frontend was initiliazed using `create-react-app` and is built with React, and uses Redux as a data store.

Lastly, if you wish to test the workflow yourself, you'll need to:

- Fork this repository
- Create several repository secrets, namely:
  - HEROKU_API_KEY: heroku auth
  - PORT: What port does the app run on?.
  - SALT_ROUNDS: used by bcrypt to hash passwords.
  - SECRET: used by jwt to create signed tokens.
  - SLACK_WEBHOOK_URL: used by the slack notification third-party-action.
  - TEST_MONGODB_URI: a test MongoDB setup used to run tests.

---

Live app: https://blogapp-552.herokuapp.com/

Fullstackopen: https://fullstackopen.com/en/

---

## To run the project locally

1. Clone the repository

2. **(Optional)** Install yarn globally `npm install yarn --global`.

3. Run `npm install && npm install:ui` from the root of the repo in terminal.

4. Create .env file at the root of the directory, containing the following contents:

- **MONGODB_URI**: The URI of your MongoDB database used in production and development

- **PORT**: What port does the app run on?

- **SALT_ROUNDS**: used by bcrypt to hash passwords

- **SECRET**: used by jwt to create signed tokens

- ### Optionally

  - **TEST_MONGODB_URI**: The URI of your MongoDB database for testing. Used when running tests with `npm run test`

5. Run `npm run build`
6. Run `npm start`

---

**IMPORTANT**: Your.env file should be gitignored.

**Note**: See `package.json` for specific scripts.
