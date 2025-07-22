# Taskipline - Backend

Building discipline with Taskipline

## Vision

Taskipline is a discipline-focused productivity platform that unifies tasks, calendar, notes, and goals—powered by AI, gamification, and a customizable experience. It helps users build long-term consistency, not just get things done.

## Tech Stack

- **Framework:** Node.js + Express
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens (JWT) with Secure Cookies
- **Validation:** Zod
- **Email Service:** Resend
- **AI:** OpenAI API
- **Notifications:** Firebase Cloud Messaging

## Getting Started

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Taskipline/backend.git
    cd taskipline/backend
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root directory by copying the example file:

    ```bash
    cp .env.example .env
    ```

    Then, fill in the values in your new `.env` file.

4. **Run the development server:**

    ```bash
    npm run dev
    ```

## API Endpoints

The API provides the following main resources:

- **`/api/v1/auth`**: Handles user authentication.
  - `POST /signup`: Register a new user.
  - `POST /signin`: Log in a user and issue tokens.
  - `POST /signout`: Log out a user.
  - `POST /refresh-token`: Issue a new access token.
  - `POST /verify-account/:token`: Verify a user's email address.
  - `POST /forgot-password`: Request a password reset link.
  - `PATCH /reset-password/:token`: Reset the user's password.
- **`/api/v1/user`**: (Protected) Handles user settings and profile management.
  - `PATCH /profile`: Update user's first and last name.
  - `PATCH /preferences`: Update user's notification and feature preferences.
  - `PATCH /change-password`: Change the authenticated user's password.
- **`/api/v1/goals`**: (Protected) Handles user goals.
  - `POST /`: Create a new goal, optionally with nested tasks.
  - `GET /`: Get all goals for the user.
  - `GET /:id`: Get a single goal by ID.
  - `PATCH /:id`: Update a goal.
  - `DELETE /:id`: Delete a goal and all its associated tasks.
- **`/api/v1/tasks`**: (Protected) Handles user tasks.
  - `POST /`: Create a new task (standalone or linked to a goal).
  - `GET /`: Get all tasks for the user.
  - `GET /:id`: Get a single task by ID.
  - `PATCH /:id`: Update a task.
  - `DELETE /:id`: Delete a task.
- **`/api/v1/waitlist`**: Handles waitlist signups.
  - `POST /join`: Add a new user to the waitlist.

## API Documentation

For detailed information on all endpoints, request bodies, and responses, the full OpenAPI (Swagger) documentation is available at `/api-docs` when the server is running.
