# Node Backend (Videotube)

A Node.js backend application for user authentication, file uploads, and user profile management, built with Express, MongoDB, Mongoose, Cloudinary, and JWT authentication.

## Features
- User registration and login with JWT authentication
- Password hashing with bcrypt
- File uploads (avatar, cover image) using Multer and Cloudinary
- User profile management
- Secure cookie handling
- CORS support
- Environment-based configuration

## Tech Stack
- Node.js
- Express.js
- MongoDB & Mongoose
- Cloudinary (media uploads)
- Multer (file handling)
- JWT (authentication)
- dotenv (environment variables)

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB instance (local or cloud)
- Cloudinary account

### Installation
1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd node_backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create an `.env` file in the `env/` directory with the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   PORT=8000
   CROS_ORIGIN=http://localhost:3000
   ```

### Running the App
```sh
npm start
```

The server will run on the port specified in your `.env` file (default: 8000).

## API Endpoints

### User Routes (`/api/v1/user`)
- `POST /register` — Register a new user (supports avatar and cover image upload)
- `POST /login` — Login user
- `POST /refresh-access-token` — Refresh JWT access token
- `POST /logout` — Logout user
- `POST /update-password` — Change password
- `GET /profile/:username` — Get user profile by username

## File Uploads
- Uploaded files are temporarily stored in `public/temp` before being uploaded to Cloudinary.

## Project Structure
```
node_backend/
├── env/
│   └── .env
├── public/
│   └── temp/
├── src/
│   ├── app.js
│   ├── index.js
│   ├── constants/
│   ├── controlers/
│   ├── db/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── validation/
├── package.json
└── README.md
```

## Author
Anjan Saha

## License
ISC
