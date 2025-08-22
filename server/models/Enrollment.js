import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  }
});

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  progress: [progressSchema],
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  progressPercentage: {
    type: Number,
    default: 0
  }
});

export default mongoose.model('Enrollment', enrollmentSchema);