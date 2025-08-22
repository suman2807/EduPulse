import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { 
  Users, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Search
} from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  createdAt: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: {
    _id: string;
    name: string;
  };
  category: string;
  level: string;
  isPublished: boolean;
  enrolledStudents: string[];
  createdAt: string;
}

interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalStudents: number;
  totalInstructors: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'courses'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, usersResponse, coursesResponse] = await Promise.all([
          api.get('/api/users/dashboard-stats'),
          api.get('/api/users/all'),
          api.get('/api/courses/admin/all')
        ]);
        
        setStats(statsResponse.data);
        setUsers(usersResponse.data);
        setCourses(coursesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/api/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
      // Refresh stats
      const statsResponse = await api.get('/api/users/dashboard-stats');
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/api/courses/${courseId}`);
      setCourses(courses.filter(course => course._id !== courseId));
      // Refresh stats
      const statsResponse = await api.get('/api/users/dashboard-stats');
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course');
    }
  };

  const handleToggleCoursePublish = async (courseId: string, currentStatus: boolean) => {
    try {
      await api.put(`/api/courses/${courseId}`, { isPublished: !currentStatus });
      setCourses(courses.map(course => 
        course._id === courseId 
          ? { ...course, isPublished: !currentStatus }
          : course
      ));
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredCourses = courses.filter(course => {
    return course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Complete platform management and oversight</p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'courses'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Course Management
          </button>
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalCourses || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalEnrollments || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Enrollment Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.totalCourses && stats?.totalEnrollments 
                      ? Math.round((stats.totalEnrollments / stats.totalCourses) * 100) / 100
                      : 0
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Students</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${stats?.totalUsers ? (stats.totalStudents / stats.totalUsers) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{stats?.totalStudents || 0}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Instructors</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${stats?.totalUsers ? (stats.totalInstructors / stats.totalUsers) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{stats?.totalInstructors || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average Courses per Instructor</span>
                  <span className="text-sm font-medium text-gray-900">
                    {stats?.totalInstructors && stats.totalInstructors > 0
                      ? Math.round((stats.totalCourses / stats.totalInstructors) * 100) / 100
                      : 0
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average Enrollments per Student</span>
                  <span className="text-sm font-medium text-gray-900">
                    {stats?.totalStudents && stats.totalStudents > 0
                      ? Math.round((stats.totalEnrollments / stats.totalStudents) * 100) / 100
                      : 0
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Platform Growth Rate</span>
                  <span className="text-sm font-medium text-green-600">+12.5%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => setActiveTab('users')}
                className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <Users className="h-6 w-6 text-blue-600 mb-2" />
                <div className="text-sm font-medium text-gray-900">Manage Users</div>
                <div className="text-xs text-gray-500">View and manage all users</div>
              </button>
              <button 
                onClick={() => setActiveTab('courses')}
                className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <BookOpen className="h-6 w-6 text-green-600 mb-2" />
                <div className="text-sm font-medium text-gray-900">Review Courses</div>
                <div className="text-xs text-gray-500">Approve and manage courses</div>
              </button>
              <Link
                to="/create-course"
                className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <Plus className="h-6 w-6 text-purple-600 mb-2" />
                <div className="text-sm font-medium text-gray-900">Create Course</div>
                <div className="text-xs text-gray-500">Add a new course</div>
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Roles</option>
                  <option value="student">Students</option>
                  <option value="instructor">Instructors</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' :
                          user.role === 'instructor' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          {user.role !== 'admin' && (
                            <button 
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Course Management</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Instructor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCourses.map((course) => (
                    <tr key={course._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{course.title}</div>
                          <div className="text-sm text-gray-500">{course.category} • {course.level}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{course.instructor.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          course.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {course.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.enrolledStudents.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link 
                            to={`/courses/${course._id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link 
                            to={`/edit-course/${course._id}`}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button 
                            onClick={() => handleToggleCoursePublish(course._id, course.isPublished)}
                            className={`${
                              course.isPublished ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {course.isPublished ? 'Unpublish' : 'Publish'}
                          </button>
                          <button 
                            onClick={() => handleDeleteCourse(course._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;