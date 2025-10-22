# Recipe Finder App

A web application for discovering and saving your favorite recipes using the Spoonacular API. Users can search for recipes, view detailed information, and maintain a personal favorites list.

## Features

- **Recipe Search**: Search for recipes using keywords
- **Recipe Details**: View detailed recipe information including ingredients and instructions
- **User Authentication**: Secure registration and login system
- **Favorites Management**: Save and manage your favorite recipes
- **Session Management**: Persistent user sessions

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Template Engine**: EJS
- **Authentication**: bcrypt for password hashing
- **API**: Spoonacular Recipe API
- **Session Management**: express-session

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pokemons
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   - Create a PostgreSQL database named `foodfinder`
   - Create the required tables:
   
   ```sql
   -- Users table
   CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       username VARCHAR(50) UNIQUE NOT NULL,
       password_hash VARCHAR(255) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Recipes table
   CREATE TABLE recipes (
       recipe_id INTEGER PRIMARY KEY,
       title VARCHAR(255) NOT NULL,
       image_url TEXT,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Favorites table
   CREATE TABLE favorites (
       id SERIAL PRIMARY KEY,
       recipe_id INTEGER REFERENCES recipes(recipe_id),
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

4. **Configure environment variables**
   - Copy the `.env` file and update it with your credentials:
   
   ```env
   # Database Configuration
   DB_USER=your_postgres_username
   DB_HOST=localhost
   DB_NAME=foodfinder
   DB_PASSWORD=your_postgres_password
   DB_PORT=5432

   # API Configuration
   API_KEY=your_spoonacular_api_key

   # Session Configuration
   SECRET_KEY=your_secret_key_for_sessions
   ```

5. **Get a Spoonacular API key**
   - Sign up at [Spoonacular API](https://spoonacular.com/food-api)
   - Get your API key and add it to the `.env` file

## Running the Application

### Development Mode
```bash
node index.js
```

### With Nodemon (for development)
```bash
# Install nodemon globally if you haven't already
npm install -g nodemon

# Run with nodemon
nodemon index.js
```

The application will start on `http://localhost:3000`

## Usage

1. **Register**: Create a new account at `/register`
2. **Login**: Sign in to your account at `/login`
3. **Search**: Use the search functionality on the homepage to find recipes
4. **View Details**: Click on any recipe to view detailed information
5. **Add to Favorites**: Save recipes to your favorites list
6. **Manage Favorites**: View and remove recipes from your favorites at `/favorites`

## API Endpoints

- `GET /` - Homepage with search functionality
- `GET /register` - User registration page
- `POST /register` - Handle user registration
- `GET /login` - User login page
- `POST /login` - Handle user login
- `GET /logout` - User logout
- `POST /search` - Search for recipes
- `GET /recipe/:id` - View recipe details
- `POST /favorite/:id` - Add recipe to favorites
- `GET /favorites` - View user's favorite recipes
- `POST /favorites/remove/:id` - Remove recipe from favorites

## Project Structure

```
├── index.js              # Main application file
├── package.json          # Project dependencies
├── .env                  # Environment variables
├── public/
│   └── styles.css        # CSS styles
└── views/
    ├── index.ejs         # Homepage template
    ├── login.ejs         # Login page template
    ├── register.ejs      # Registration page template
    ├── recipe.ejs        # Recipe details template
    ├── favorites.ejs     # Favorites page template
    └── partials/         # Reusable template components
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Notes

- Make sure your PostgreSQL server is running before starting the application
- The application uses sessions that expire after 24 hours
- All passwords are securely hashed using bcrypt
- The app requires an active internet connection to fetch recipes from the Spoonacular API
