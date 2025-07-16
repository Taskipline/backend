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

    Then, fill in the values in your new `.env` file. It requires the following variables:

    ```env
    # Application
    PORT=5000
    NODE_ENV=development
    CLIENT_URL=http://localhost:3000

    # Database
    MONGO_DB_URI=your_mongodb_connection_string

    # JWT & Cookies
    ACCESS_TOKEN_SECRET=your_strong_access_token_secret
    ACCESS_TOKEN_LIFETIME=15m
    REFRESH_TOKEN_SECRET=your_very_strong_refresh_token_secret
    REFRESH_TOKEN_LIFETIME=7d
    COOKIE_PARSER_SECRET=your_strong_cookie_parser_secret

    # Resend API Keys
    RESEND_API_KEY_WAITLIST=your_resend_api_key
    RESEND_API_KEY_VERIFY_ACCOUNT=your_resend_api_key
    RESEND_API_KEY_WELCOME=your_resend_api_key
    RESEND_API_KEY_PASSWORD_RESET_LINK=your_resend_api_key
    RESEND_API_KEY_PASSWORD_RESET_SUCCESSFUL=your_resend_api_key
    ```

4. **Run the development server:**

    ```bash
    npm run dev
    ```

5. **API Documentation:**

    The API documentation is available at
