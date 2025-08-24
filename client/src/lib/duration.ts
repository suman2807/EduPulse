// Utility function to calculate and format course duration
interface Module {
  duration: number;
}

export const calculateCourseDuration = (modules: Module[]): string => {
  const totalMinutes = modules.reduce((total, module) => total + module.duration, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}m`;
  }
};

// Get total duration in minutes
export const getTotalDurationMinutes = (modules: Module[]): number => {
  return modules.reduce((total, module) => total + module.duration, 0);
};

// Format duration from minutes to readable string
export const formatDuration = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}m`;
  }
};