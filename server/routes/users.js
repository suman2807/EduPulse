import express from 'express';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard stats
router.get('/dashboard-stats', auth, async (req, res) => {
  try {
    let stats = {};

    if (req.user.role === 'student') {
  const enrollments = await Enrollment.find({ student: req.user.userId })
    .populate({
      path: 'course',
      populate: {
        path: 'instructor',
        select: 'name avatar'
      }
    });

  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter(e => e.progressPercentage === 100).length;

  stats = {
    totalCourses,
    completedCourses,
    inProgressCourses: totalCourses - completedCourses,
    enrollments
  };
    } else if (req.user.role === 'instructor') {
      const courses = await Course.find({ instructor: req.user.userId });
      const totalCourses = courses.length;
      const totalStudents = courses.reduce((sum, course) => sum + course.enrolledStudents.length, 0);
      
      stats = {
        totalCourses,
        totalStudents,
        publishedCourses: courses.filter(c => c.isPublished).length,
        courses
      };
    } else if (req.user.role === 'admin') {
      const totalUsers = await User.countDocuments();
      const totalCourses = await Course.countDocuments();
      const totalEnrollments = await Enrollment.countDocuments();
      
      stats = {
        totalUsers,
        totalCourses,
        totalEnrollments,
        totalStudents: await User.countDocuments({ role: 'student' }),
        totalInstructors: await User.countDocuments({ role: 'instructor' })
      };
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users (Admin only)
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin users' });
    }

    // Delete user's courses if they're an instructor
    if (user.role === 'instructor') {
      await Course.deleteMany({ instructor: user._id });
    }

    // Delete user's enrollments if they're a student
    if (user.role === 'student') {
      await Enrollment.deleteMany({ student: user._id });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;