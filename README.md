6# FilmFind

FilmFind is a web application for discovering and tracking movies and TV shows.

## Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (v14 or later)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js)
*   A [Supabase](https://supabase.com/) account
*   A [Clerk](https://clerk.com/) account

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

    Create a `.env` file in the root of the project and add the following variables:

    ```
    REACT_APP_SUPABASE_URL=your-supabase-url
    REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
    CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
    CLERK_SECRET_KEY=your-clerk-secret-key
    ```

    You can find your Supabase URL and anon key in your Supabase project settings. You can find your Clerk publishable and secret keys in your Clerk dashboard.

2.  **Set up the Supabase database:**

    Log in to your Supabase account and run the SQL from the `supabase_setup.sql` file in the SQL editor.

3.  **Set up Prisma:**

    Run the following commands to generate the Prisma client and push the schema to the database:

    ```bash
    npx prisma generate
    npx prisma db push
    ```

## Running the Application

*   **Development mode:**

    ```bash
    npm run dev
    ```

    This will start the React development server.

*   **Production mode:**

    ```bash
    npm run serve
    ```

    This will build the React application and start the Node.js server.

## Deployment

To deploy the application to Firebase Hosting, run the following command:

```bash
firebase deploy
```

This will deploy the contents of the `build` directory to Firebase Hosting.
