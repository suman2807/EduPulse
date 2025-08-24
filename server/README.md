# EduPulse Server

This is the backend API server for the EduPulse Online Learning Portal built with Node.js and Express.

## Features

- Express.js REST API
- MongoDB with Mongoose ODM
- JWT Authentication
- File upload with Multer
- Role-based access control
- CORS enabled

## Environment Variables

Create a `.env` file in the server directory with:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

## Development

```bash
# Install dependencies
npm install

# Start development server with nodemon
npm run dev

# Start production server
npm start
```

## API Endpoints

- `/api/auth` - Authentication routes
- `/api/courses` - Course management
- `/api/users` - User management
- `/api/enrollments` - Enrollment management

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Multer for file uploads
- Cloudinary for image storage