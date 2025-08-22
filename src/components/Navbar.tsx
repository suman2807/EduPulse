import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, User, LogOut, Plus, Home, Search } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Edupulse</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/dashboard"
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              
              <Link
                to="/courses"
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Search className="h-4 w-4" />
                <span>Browse Courses</span>
              </Link>
              
              {user.role === 'instructor' && (
                <Link
                  to="/create-course"
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Course</span>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;