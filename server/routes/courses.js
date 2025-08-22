import express from 'express';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate('instructor', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar bio');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create course (Instructor only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const course = new Course({
      ...req.body,
      instructor: req.user.userId
    });

    await course.save();
    await course.populate('instructor', 'name avatar');
    
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update course
router.put('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('instructor', 'name avatar');
    
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete course
router.delete('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Course.findByIdAndDelete(req.params.id);
    await Enrollment.deleteMany({ course: req.params.id });
    
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get instructor's courses
router.get('/instructor/my-courses', auth, async (req, res) => {
  try {
    if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const courses = await Course.find({ instructor: req.user.userId })
      .populate('instructor', 'name avatar')
      .sort({ createdAt: -1 });
    
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all courses (Admin only)
router.get('/admin/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const courses = await Course.find({})
      .populate('instructor', 'name avatar')
      .sort({ createdAt: -1 });
    
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;