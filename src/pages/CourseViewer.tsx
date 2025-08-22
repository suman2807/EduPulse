import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { ChevronLeft, ChevronRight, Check, Book } from 'lucide-react';

interface Module {
  _id: string;
  title: string;
  description: string;
  content: string;
  videoUrl: string;
  duration: number;
  order: number;
}

interface Course {
  _id: string;
  title: string;
  modules: Module[];
}

interface Enrollment {
  _id: string;
  progress: Array<{
    moduleId: string;
    completed: boolean;
    completedAt?: string;
  }>;
  progressPercentage: number;
}
function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}


const CourseViewer: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseResponse, enrollmentResponse] = await Promise.all([
          api.get(`/api/courses/${courseId}`),
          api.get('/api/enrollments/my-enrollments')
        ]);

        setCourse(courseResponse.data);
        
        const userEnrollment = enrollmentResponse.data.find(
          (enrollment: { course: { _id: string } }) => enrollment.course._id === courseId
        );
        setEnrollment(userEnrollment);
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const handleModuleComplete = async (moduleId: string, completed: boolean) => {
    if (!enrollment) return;

    try {
      const response = await api.put(
        `/api/enrollments/progress/${enrollment._id}/${moduleId}`,
        { completed }
      );
      setEnrollment(response.data);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const isModuleCompleted = (moduleId: string) => {
    if (!enrollment) return false;
    const moduleProgress = enrollment.progress.find(p => p.moduleId === moduleId);
    return moduleProgress?.completed || false;
  };

  const goToNextModule = () => {
    if (course && currentModuleIndex < course.modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
    }
  };

  const goToPreviousModule = () => {
    if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course || !enrollment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h1>
        <p className="text-gray-600">Please make sure you're enrolled in this course.</p>
      </div>
    );
  }

  const sortedModules = course.modules.sort((a, b) => a.order - b.order);
  const currentModule = sortedModules[currentModuleIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Module List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 sticky top-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900 mb-2">{course.title}</h2>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${enrollment.progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {enrollment.progressPercentage}% Complete
              </p>
            </div>
            
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {sortedModules.map((module, index) => (
                  <button
                    key={module._id}
                    onClick={() => setCurrentModuleIndex(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      index === currentModuleIndex
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {isModuleCompleted(module._id) ? (
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <Check className="h-4 w-4 text-green-600" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 text-sm">{index + 1}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {module.title}
                        </p>
                        <p className="text-xs text-gray-500">{module.duration} min</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            {/* Module Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{currentModule.title}</h1>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleModuleComplete(
                      currentModule._id,
                      !isModuleCompleted(currentModule._id)
                    )}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isModuleCompleted(currentModule._id)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {isModuleCompleted(currentModule._id) ? 'Completed' : 'Mark Complete'}
                    </span>
                  </button>
                </div>
              </div>
              <p className="text-gray-600">{currentModule.description}</p>
            </div>

            {/* Module Content */}
            <div className="p-6">
              {/* Video Player */}
              {currentModule.videoUrl && getYouTubeEmbedUrl(currentModule.videoUrl) && (
  <div className="mb-8">
    <div className="aspect-video rounded-lg overflow-hidden">
      <iframe
        className="w-full h-full"
        src={getYouTubeEmbedUrl(currentModule.videoUrl)!}
        title="Module Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  </div>
)}

              {/* Module Content */}
              <div className="prose max-w-none">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Book className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Module Content</h3>
                  </div>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {currentModule.content}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={goToPreviousModule}
                  disabled={currentModuleIndex === 0}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <span className="text-sm text-gray-600">
                  Module {currentModuleIndex + 1} of {sortedModules.length}
                </span>

                <button
                  onClick={goToNextModule}
                  disabled={currentModuleIndex === sortedModules.length - 1}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;