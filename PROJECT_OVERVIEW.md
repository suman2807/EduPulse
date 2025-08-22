# Project Overview

## 🎯 What This Project Does

This is an **Online Learning Portal** - think of it like a mini Udemy or Coursera. It allows:
- Students to browse and enroll in courses
- Instructors to create and manage courses
- Admins to oversee everything

## 🏗️ How It's Built

### Frontend (What users see)
- **React** - Makes the website interactive
- **TypeScript** - Catches errors before they happen
- **Tailwind CSS** - Makes it look beautiful
- **Vite** - Makes development fast

### Backend (What runs on the server)
- **Node.js** - The server engine
- **Express** - Handles web requests
- **MongoDB** - Stores all the data
- **JWT** - Keeps users logged in securely

## 🔄 How It Works

1. **User visits the website** → React app loads
2. **User logs in** → Backend checks credentials
3. **User browses courses** → Backend sends course data
4. **User enrolls** → Backend saves enrollment
5. **User takes course** → Progress is tracked

## 📱 Key Pages

- **Landing Page** - Welcome and course showcase
- **Login/Register** - User authentication
- **Browse Courses** - See all available courses
- **Course Details** - Learn about a specific course
- **Dashboard** - Personal area for each user type

## 🚀 Quick Start

```bash
npm install    # Get all the tools
npm run dev    # Start everything
```

That's it! The app will be running at `http://localhost:3000`

## 💡 Why This Structure?

- **Separate frontend/backend** - Easy to work on each part independently
- **TypeScript everywhere** - Fewer bugs, better code
- **Modern tools** - Fast development, good performance
- **Clear organization** - Easy to find and fix things
