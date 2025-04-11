# Personal Library Management System

A comprehensive personal library management application that allows you to catalog, organize, and track your book collection. Easily search books by ISBN, organize them into bookshelves and categories, and manage your reading inventory.

## Features

- **Book Management**:

  - Add books to your library by ISBN using Google Books API integration
  - View detailed book information including cover images, descriptions, and metadata
  - Edit book details and organization
  - Delete books from your collection

- **Library Organization**:

  - Create custom bookshelves to organize your physical collection
  - Categorize books by genre or custom categories
  - Track book series and volume numbers
  - Sort and filter your collection

- **User Experience**:
  - Search and filter books by title, author, series, category, or bookshelf
  - User authentication with secure JWT token system
  - Responsive design works on desktop and mobile devices

## Technology Stack

### Backend

- **Django / Django REST Framework**: Python-based web framework
- **PostgreSQL**: Database for storing application data
- **Simple JWT**: Token-based authentication
- **Google Books API**: For fetching book data by ISBN

### Frontend

- **React**: JavaScript library for building the user interface
- **React Router**: For application routing and navigation
- **React Bootstrap**: UI component library
- **FontAwesome**: Icon library
- **Vite**: Build tool and development server

## Installation

### Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/personal-library.git
   cd personal-library
   ```

2. Create and activate a virtual environment:

   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the project root with the following variables:

   ```
   JWT_SIGNING_KEY=your_secret_key
   DB_PASSWORD=your_postgres_password
   DB_USERNAME=postgres
   GOOGLE_BOOKS_API_KEY=your_google_api_key
   ```

5. Create the PostgreSQL database:

   ```bash
   createdb personal_library_development
   ```

6. Run migrations:

   ```bash
   python manage.py migrate
   ```

7. Start the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. The development server will start at `http://localhost:5173` and automatically proxy API requests to the Django backend.

## Usage

### User Authentication

- Register a new account or login with existing credentials
- The application uses HTTP-only cookies for secure JWT token storage

### Managing Your Library

- **Catalogue View**: Browse all books in your library with advanced filtering
- **Bookshelves View**: Organize books into physical shelves that match your home setup
- **Adding Books**:
  1. Click "Add Book"
  2. Enter the ISBN
  3. Review the book data retrieved from Google Books API
  4. Select bookshelf, category, and series information
  5. Click "Add Book" to save to your library

### Organizing Books

- Create categories for different genres or custom organization
- Create bookshelves to match your physical storage
- Group books into series and track volume numbers
- Edit book details including moving between bookshelves

## Project Structure

```
personal_library/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── managers/       # API service functions
│   │   └── ...
├── library_api/            # Django app for the REST API
│   ├── migrations/         # Database migrations
│   ├── models.py           # Data models
│   ├── serializers.py      # DRF serializers
│   ├── views.py            # API views and endpoints
│   └── ...
├── personal_library/       # Django project settings
├── manage.py               # Django management script
├── requirements.txt        # Python dependencies
└── .env                    # Environment variables (not in version control)
```

## API Documentation

### Authentication Endpoints

- `POST /api/register/`: Register a new user
- `POST /api/token/`: Obtain JWT token pair
- `POST /api/token/refresh/`: Refresh access token
- `POST /api/logout/`: Logout (clear tokens)

### Book Endpoints

- `GET /api/books/`: List all books in user's library
- `POST /api/books/`: Add a new book
- `GET /api/books/{id}/`: Get book details
- `PUT /api/books/{id}/`: Update book
- `DELETE /api/books/{id}/`: Delete book
- `GET /api/books/search/?isbn=<isbn>`: Search book by ISBN

### Organization Endpoints

- `GET|POST|PUT|DELETE /api/bookshelves/`: Manage bookshelves
- `GET|POST|PUT|DELETE /api/categories/`: Manage categories
- `GET|POST|PUT|DELETE /api/series/`: Manage series

## Future Enhancements

- Reading statistics and progress tracking
- Loan management to track borrowed books
- Integration with other book APIs
- Mobile application
- Book recommendations
- Import/export collection data

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Google Books API for providing book data
- The Django and React communities for excellent documentation
