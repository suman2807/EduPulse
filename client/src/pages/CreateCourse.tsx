import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useToast } from '../contexts/ToastContext';
import { Plus, Trash2, Save, Upload, X } from 'lucide-react';

interface Module {
  title: string;
  description: string;
  content: string;
  videoUrl: string;
  duration: number;
  order: number;
}
function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}
const CreateCourse: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    thumbnail: ''
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [modules, setModules] = useState<Module[]>([{
    title: '',
    description: '',
    content: '',
    videoUrl: '',
    duration: 0,
    order: 0
  }]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        error('Invalid File Type', 'Please select an image file.');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        error('File Too Large', 'Please select an image smaller than 5MB.');
        return;
      }
      
      setThumbnailFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview('');
    setCourseData({ ...courseData, thumbnail: '' });
  };

  const uploadThumbnail = async (): Promise<string> => {
    if (!thumbnailFile) return '';
    
    const formData = new FormData();
    formData.append('thumbnail', thumbnailFile);
    
    try {
      const response = await api.post('/api/courses/upload-thumbnail', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.thumbnail;
    } catch (err) {
      error('Upload Failed', 'Failed to upload thumbnail image.');
      throw err;
    }
  };

  const handleCourseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCourseData({
      ...courseData,
      [name]: value
    });
  };

  const handleModuleChange = (index: number, field: keyof Module, value: string | number) => {
    const updatedModules = modules.map((module, i) => 
      i === index ? { ...module, [field]: value } : module
    );
    setModules(updatedModules);
  };

  const addModule = () => {
    setModules([...modules, {
      title: '',
      description: '',
      content: '',
      videoUrl: '',
      duration: 0,
      order: modules.length
    }]);
  };

  const removeModule = (index: number) => {
    if (modules.length > 1) {
      const updatedModules = modules.filter((_, i) => i !== index);
      // Update order for remaining modules
      const reorderedModules = updatedModules.map((module, i) => ({
        ...module,
        order: i
      }));
      setModules(reorderedModules);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload thumbnail if provided
      let thumbnailPath = '';
      if (thumbnailFile) {
        thumbnailPath = await uploadThumbnail();
      }

      const coursePayload = {
        ...courseData,
        thumbnail: thumbnailPath,
        modules: modules.map((module, index) => ({
          ...module,
          order: index
        }))
      };

      await api.post('/api/courses', coursePayload);
      success('Course Created Successfully!', 'Your course has been created and is ready for students.');
      
      // Add a small delay to ensure the toast is rendered before navigation
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create course';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        error('Failed to Create Course', axiosError.response?.data?.message || errorMessage);
      } else {
        error('Failed to Create Course', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Course</h1>
        <p className="text-gray-600">Share your knowledge by creating an engaging course</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Course Basic Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Course Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Title
              </label>
              <input
                type="text"
                name="title"
                required
                value={courseData.title}
                onChange={handleCourseChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter course title"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Description
              </label>
              <textarea
                name="description"
                required
                rows={4}
                value={courseData.description}
                onChange={handleCourseChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe what students will learn in this course"
              />
            </div>

            {/* Thumbnail Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Thumbnail (Optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                <div className="space-y-1 text-center">
                  {thumbnailPreview ? (
                    <div className="relative">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="mx-auto h-32 w-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeThumbnail}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, WebP up to 5MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                required
                value={courseData.category}
                onChange={handleCourseChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Programming, Design, Business"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
              <select
                name="level"
                value={courseData.level}
                onChange={handleCourseChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Course Modules */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Course Modules</h2>
            <button
              type="button"
              onClick={addModule}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Module</span>
            </button>
          </div>

          <div className="space-y-6">
            {modules.map((module, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Module {index + 1}</h3>
                  {modules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeModule(index)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Module Title
                    </label>
                    <input
                      type="text"
                      required
                      value={module.title}
                      onChange={(e) => handleModuleChange(index, 'title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter module title"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Module Description
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={module.description}
                      onChange={(e) => handleModuleChange(index, 'description', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Brief description of this module"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Module Content
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={module.content}
                      onChange={(e) => handleModuleChange(index, 'content', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Detailed content for this module"
                    />
                  </div>

                   <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Video URL (YouTube only)</label>
                <input
                  type="url"
                  value={module.videoUrl}
                  onChange={(e) => handleModuleChange(index, 'videoUrl', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                {module.videoUrl && getYouTubeEmbedUrl(module.videoUrl) && (
                  <div className="mt-4">
                    <iframe
                      width="100%"
                      height="315"
                      src={getYouTubeEmbedUrl(module.videoUrl)!}
                      title={`Module Video Preview ${index + 1}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg border"
                    />
                  </div>
                )}
              </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={module.duration}
                      onChange={(e) => handleModuleChange(index, 'duration', Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? 'Creating...' : 'Create Course'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourse;