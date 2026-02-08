# EduPulse - Online Learning Portal

A modern, full-stack online learning platform built with React, TypeScript, Node.js, and MongoDB.

## 🚀 Features

- **User Authentication**: Secure login/registration with JWT
- **Role-based Access**: Separate dashboards for students, instructors, and admins
- **Course Management**: Create, edit, and manage courses
- **Course Enrollment**: Students can enroll in courses
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Real-time Updates**: Live course progress tracking

## 🛠️ Tech Stack

### Frontend (`/client`)
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls

### Backend (`/server`)
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Multer for file uploads
- bcryptjs for password hashing

## 📁 Project Structure

```
Online-Learniing-Portal-main/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── lib/            # API utilities
│   │   └── pages/          # Application pages
│   └── package.json        # Client dependencies
├── server/                 # Backend Node.js application
│   ├── models/             # MongoDB models
│   ├── routes/             # API endpoints
│   ├── middleware/         # Express middleware
│   ├── .env                # Server environment variables
│   └── package.json        # Server dependencies
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Online-Learniing-Portal-main
   ```

2. **Install dependencies**
   ```bash
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Environment Setup**
   
   **Server** (`/server/.env`):
   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start the application**
   
   **Terminal 1 - Backend:**
   ```bash
   cd server
   npm run dev
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173/
   - Backend API: http://localhost:5001/api/

## 📱 Available Scripts

### Client (`/client`)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Server (`/server`)
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## 🔐 Default Admin Account

The system automatically creates an admin account:
- **Email**: admin@example.com
- **Password**: admin123

## 🔗 API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create new course (instructor only)
- `GET /api/enrollments` - Get user enrollments
- `POST /api/enrollments` - Enroll in a course
- `GET /api/users` - Get users (admin only)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
