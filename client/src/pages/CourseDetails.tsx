import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { calculateCourseDuration } from '../lib/duration';
import { Clock, Users, BookOpen, Play, CheckCircle } from 'lucide-react';

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: {
    _id: string;
    name: string;
    avatar: string;
    bio: string;
  };
  modules: Array<{
    _id: string;
    title: string;
    description: string;
    content: string;
    videoUrl: string;
    duration: number;
    order: number;
  }>;
  category: string;
  level: string;
  duration: number;
  enrolledStudents: string[];
  isPublished: boolean;
  createdAt: string;
}

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [unenrolling, setUnenrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/api/courses/${id}`);
        setCourse(response.data);
        
        // Check if user is enrolled
        if (user?.role === 'student') {
          const enrollmentResponse = await api.get('/api/enrollments/my-enrollments');
          const enrollments = enrollmentResponse.data;
          setIsEnrolled(enrollments.some((enrollment: { course: { _id: string } }) => enrollment.course._id === id));
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'student') {
      showError('Only students can enroll in courses');
      return;
    }

    setEnrolling(true);
    try {
      await api.post(`/api/enrollments/enroll/${id}`);
      setIsEnrolled(true);
      showSuccess('Successfully enrolled in the course!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to enroll in course';
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        showError(axiosError.response?.data?.message || errorMessage);
      } else {
        showError(errorMessage);
      }
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartLearning = () => {
    navigate(`/learn/${id}`);
  };

  const handleUnenroll = async () => {
    if (!user || !course) return;

    const confirmUnenroll = window.confirm(
      `Are you sure you want to unenroll from "${course.title}"? This will remove all your progress.`
    );

    if (!confirmUnenroll) return;

    setUnenrolling(true);
    try {
      await api.delete(`/api/enrollments/unenroll/${id}`);
      setIsEnrolled(false);
      showSuccess('Successfully unenrolled from the course');
      
      // Update enrolled students count
      if (course) {
        setCourse({
          ...course,
          enrolledStudents: course.enrolledStudents.filter(
            studentId => studentId !== user.id
          )
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to unenroll from course';
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        showError(axiosError.response?.data?.message || errorMessage);
      } else {
        showError(errorMessage);
      }
    } finally {
      setUnenrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h1>
        <p className="text-gray-600">The course you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Course Header */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {course.category}
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                {course.level}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">{course.description}</p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {course.enrolledStudents.length} students
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                {course.modules.length} modules
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {calculateCourseDuration(course.modules)}
              </div>
            </div>
          </div>

          {/* Course Modules */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Course Content</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {course.modules
                  .sort((a, b) => a.order - b.order)
                  .map((module, index) => (
                    <div
                      key={module._id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                          <span className="text-blue-600 text-sm font-medium">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">{module.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{module.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            {module.videoUrl && (
                              <div className="flex items-center">
                                <Play className="h-3 w-3 mr-1" />
                                Video
                              </div>
                            )}
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {module.duration} min
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Course Preview */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 sticky top-8">
            <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
              {course.thumbnail ? (
                <img
                  src={`http://localhost:5001${course.thumbnail}`}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Play className="h-16 w-16 text-white" />
              )}
            </div>
            
            <div className="p-6">
              {user?.role === 'student' && (
                <div className="mb-6">
                  {isEnrolled ? (
                    <div className="space-y-2">
                      <button
                        onClick={handleStartLearning}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center"
                      >
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Continue Learning
                      </button>
                      <button
                        onClick={handleUnenroll}
                        disabled={unenrolling}
                        className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {unenrolling ? 'Unenrolling...' : 'Unenroll from Course'}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {enrolling ? 'Enrolling...' : 'Enroll Now'}
                    </button>
                  )}
                </div>
              )}

              {/* Instructor Info */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Your Instructor</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {course.instructor.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{course.instructor.name}</p>
                    <p className="text-sm text-gray-600">Instructor</p>
                  </div>
                </div>
                {course.instructor.bio && (
                  <p className="text-sm text-gray-600 mt-3">{course.instructor.bio}</p>
                )}
              </div>

              {/* Course Stats */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Course Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Students Enrolled</span>
                    <span className="text-gray-900">{course.enrolledStudents.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Modules</span>
                    <span className="text-gray-900">{course.modules.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Course Level</span>
                    <span className="text-gray-900 capitalize">{course.level}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;