import express from 'express';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Enroll in course
router.post('/enroll/:courseId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can enroll in courses' });
    }

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const existingEnrollment = await Enrollment.findOne({
      student: req.user.userId,
      course: req.params.courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const progress = course.modules.map(module => ({
      moduleId: module._id,
      completed: false
    }));

    const enrollment = new Enrollment({
      student: req.user.userId,
      course: req.params.courseId,
      progress
    });

    await enrollment.save();
    
    // Add student to course's enrolled students
    course.enrolledStudents.push(req.user.userId);
    await course.save();

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get student's enrollments
router.get('/my-enrollments', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const enrollments = await Enrollment.find({ student: req.user.userId })
      .populate('course')
      .sort({ enrolledAt: -1 });
    
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update module progress
router.put('/progress/:enrollmentId/:moduleId', auth, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.enrollmentId);
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    if (enrollment.student.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const moduleProgress = enrollment.progress.find(
      p => p.moduleId.toString() === req.params.moduleId
    );

    if (!moduleProgress) {
      return res.status(404).json({ message: 'Module not found' });
    }

    moduleProgress.completed = req.body.completed;
    if (req.body.completed) {
      moduleProgress.completedAt = new Date();
    }

    // Calculate progress percentage
    const completedModules = enrollment.progress.filter(p => p.completed).length;
    enrollment.progressPercentage = Math.round(
      (completedModules / enrollment.progress.length) * 100
    );

    await enrollment.save();
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;