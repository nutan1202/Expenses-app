1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd <project-folder>
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

   This will install all necessary packages from `package.json`, including:
   - `express` (for building the server)
   - `mongoose` (for MongoDB integration)
   - `dotenv` (for environment variable management)
   - `body-parser` (to parse incoming request bodies)
   - `nodemon` (for auto-restarting the server during development)

3. Create a `.env` file in the root of your project:

    ```bash
    touch .env
    ```

   Add the following content to your `.env` file:

    ```
    PORT=5000
    MONGO_URI=<Your MongoDB Connection String>
    ```

4. Start the server:

    ```bash
    npm start
    ```

   This will start your backend at `http://localhost:5000`.