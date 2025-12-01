# FilmFind

FilmFind is a web application for discovering and tracking movies and TV shows. It uses the TMDB API to fetch movie and TV show data and Clerk for user authentication.

## Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (v14 or later)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js)
*   A [Clerk](https://clerk.com/) account
*   A [TMDB](https://www.themoviedb.org/documentation/api) API key

## Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd FilmFind
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

## Configuration

1.  **Set up environment variables:**

    Create a `.env` file in the root of the project and add the following variables. You can use the `.env.example` file as a template.

    ```
    REACT_APP_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
    REACT_APP_TMDB_API_KEY=your-tmdb-api-key
    ```

    You can find your Clerk publishable key in your Clerk dashboard. You can get a TMDB API key by creating an account on the TMDB website.

## Running the Application

*   **Development mode:**

    ```bash
    npm run dev
    ```

    This will start the React development server.

*   **Production build:**

    ```bash
    npm run build
    ```

    This will build the React application for production.

## Deployment

To deploy the application, you can use any static site hosting service. For example, to deploy to Firebase Hosting, you can run:

```bash
firebase deploy --only hosting
```

This will deploy the contents of the `build` directory to Firebase Hosting.
