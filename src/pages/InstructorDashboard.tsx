import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Plus, BookOpen, Users, Eye, Edit, Trash2 } from 'lucide-react';

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  enrolledStudents: string[];
  isPublished: boolean;
  modules: Array<{
    _id: string;
    title: string;
    description: string;
    content: string;
    videoUrl: string;
    duration: number;
    order: number;
  }>;
  createdAt: string;
}

interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  publishedCourses: number;
  courses: Course[];
}

const InstructorDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/users/dashboard-stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      await api.delete(`/api/courses/${courseId}`);
      // Refresh stats
      const response = await api.get('/api/users/dashboard-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Instructor Dashboard</h1>
          <p className="text-gray-600">Manage your courses and track student progress</p>
        </div>
        <Link
          to="/create-course"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Course
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalCourses || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalStudents || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.publishedCourses || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* My Courses */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
        </div>

        <div className="p-6">
          {stats?.courses && stats.courses.length > 0 ? (
            <div className="space-y-4">
              {stats.courses.map((course) => (
                <div
                  key={course._id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            course.isPublished
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {course.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {course.enrolledStudents.length} students
                        </span>
                        <span className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {course.modules.length} modules
                        </span>
                        <span>{course.category}</span>
                        <span className="capitalize">{course.level}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        to={`/courses/${course._id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View Course"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/edit-course/${course._id}`}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        title="Edit Course"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteCourse(course._id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Course"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses created yet</h3>
              <p className="text-gray-600 mb-6">
                Start sharing your knowledge by creating your first course
              </p>
              <Link
                to="/create-course"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Course
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;