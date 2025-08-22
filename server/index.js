import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courses.js';
import userRoutes from './routes/users.js';
import enrollmentRoutes from './routes/enrollments.js';
import User from './models/User.js'; // Import your User model

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/enrollments', enrollmentRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edupulse')
  .then(async () => {
    console.log('MongoDB Connected');

    // Create Admin User if not exists
    const adminEmail = 'admin@example.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: 'admin123', // Let the User model handle hashing automatically
        role: 'admin'
      });
      console.log(`Admin user created. Email: ${adminEmail}, Password: admin123`);
    } else {
      console.log('Admin user already exists.');
    }
  })
  .catch(err => console.log('MongoDB Connection Error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
