import React, { createContext, useContext, useState, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  success: (title: string, message?: string, duration?: number) => void;
  error: (title: string, message?: string, duration?: number) => void;
  warning: (title: string, message?: string, duration?: number) => void;
  info: (title: string, message?: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: Toast['type'], title: string, message?: string, duration: number = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, type, title, message, duration };
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (title: string, message?: string, duration?: number) => {
    addToast('success', title, message, duration);
  };

  const error = (title: string, message?: string, duration?: number) => {
    addToast('error', title, message, duration);
  };

  const warning = (title: string, message?: string, duration?: number) => {
    addToast('warning', title, message, duration);
  };

  const info = (title: string, message?: string, duration?: number) => {
    addToast('info', title, message, duration);
  };

  const getToastIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getToastStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-white border-green-300 text-gray-900';
      case 'error':
        return 'bg-white border-red-300 text-gray-900';
      case 'warning':
        return 'bg-white border-yellow-300 text-gray-900';
      case 'info':
        return 'bg-white border-blue-300 text-gray-900';
      default:
        return 'bg-white border-blue-300 text-gray-900';
    }
  };

  return (
    <ToastContext.Provider value={{ toasts, success, error, warning, info, removeToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-8 right-8 z-[9999] space-y-3 pointer-events-none max-w-md">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`w-full ${getToastStyles(toast.type)} border-2 rounded-xl shadow-2xl p-4 transform transition-all duration-300 ease-in-out pointer-events-auto backdrop-blur-sm`}
            style={{
              transform: 'translateX(0)',
              opacity: 1,
              animation: 'slideInFromRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {getToastIcon(toast.type)}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {toast.title}
                </p>
                {toast.message && (
                  <p className="mt-1 text-sm text-gray-600">
                    {toast.message}
                  </p>
                )}
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-1 transition-colors duration-150"
                  onClick={() => removeToast(toast.id)}
                  aria-label="Close notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Add custom animation styles */}
      <style>{`
        @keyframes slideInFromRight {
          from {
            transform: translateX(120%) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }
        
        /* Ensure toasts appear above all content */
        .toast-container {
          z-index: 9999 !important;
        }
      `}</style>
    </ToastContext.Provider>
  );
};