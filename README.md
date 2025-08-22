# Online Learning Portal

A modern, full-stack online learning platform built with React, TypeScript, Node.js, and MongoDB.

## 🚀 Features

- **User Authentication**: Secure login/registration with JWT
- **Role-based Access**: Separate dashboards for students, instructors, and admins
- **Course Management**: Create, edit, and manage courses
- **Course Enrollment**: Students can enroll in courses
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Real-time Updates**: Live course progress tracking

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- React Router for navigation

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Multer for file uploads

## 📁 Project Structure

```
Online-Learniing-Portal-main/
├── 📁 src/                    # Frontend source code
│   ├── 📁 components/        # Reusable UI components
│   │   ├── LoadingSpinner.tsx
│   │   ├── LogoIcon.tsx
│   │   └── Navbar.tsx
│   ├── 📁 contexts/          # React contexts (Auth)
│   │   └── AuthContext.tsx
│   ├── 📁 lib/               # Utility functions and API
│   │   └── api.ts
│   └── 📁 pages/             # Application pages
│       ├── AdminDashboard.tsx
│       ├── BrowseCourses.tsx
│       ├── CourseDetails.tsx
│       ├── CourseViewer.tsx
│       ├── CreateCourse.tsx
│       ├── EditCourse.tsx
│       ├── InstructorDashboard.tsx
│       ├── LandingPage.tsx
│       ├── Login.tsx
│       ├── Register.tsx
│       └── StudentDashboard.tsx
├── 📁 server/                # Backend source code
│   ├── 📁 models/            # MongoDB models
│   │   ├── Course.js
│   │   ├── Enrollment.js
│   │   └── User.js
│   ├── 📁 routes/            # API endpoints
│   │   ├── auth.js
│   │   ├── courses.js
│   │   ├── enrollments.js
│   │   └── users.js
│   ├── 📁 middleware/        # Express middleware
│   │   └── auth.js
│   └── index.js              # Server entry point
├── 📄 index.html             # Main HTML file
├── 📄 package.json           # Dependencies and scripts
├── 📄 tsconfig.json          # TypeScript configuration
├── 📄 vite.config.ts         # Vite configuration
├── 📄 tailwind.config.js     # Tailwind CSS configuration
├── 📄 postcss.config.js      # PostCSS configuration
├── 📄 eslint.config.js       # ESLint configuration
└── 📄 .gitignore             # Git ignore rules
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB installed and running

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Online-Learniing-Portal-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. **Run the application**
   ```bash
   # Development mode (runs both frontend and backend)
   npm run dev
   
   # Or run separately:
   npm run client    # Frontend only
   npm run server    # Backend only
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📱 Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run client` - Start only the frontend (Vite dev server)
- `npm run server` - Start only the backend (Node.js server)
- `npm run build` - Build the frontend for production
- `npm run lint` - Run ESLint to check code quality

## 🔐 API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create new course (instructor only)
- `GET /api/enrollments` - Get user enrollments
- `POST /api/enrollments` - Enroll in a course

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.