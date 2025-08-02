export const formatTime = (date: Date | string | number): string => {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : 
                     typeof date === 'number' ? new Date(date) : date;
  const diffInMs = now.getTime() - targetDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);

  if (diffInMinutes < 1) {
    return 'now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  } else {
    return targetDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: targetDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
};

export const formatFullDate = (date: Date | string | number): string => {
  const targetDate = typeof date === 'string' ? new Date(date) : 
                     typeof date === 'number' ? new Date(date) : date;
  return targetDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatTimeOnly = (date: Date | string | number): string => {
  const targetDate = typeof date === 'string' ? new Date(date) : 
                     typeof date === 'number' ? new Date(date) : date;
  return targetDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
};

export const isToday = (date: Date | string | number): boolean => {
  const targetDate = typeof date === 'string' ? new Date(date) : 
                     typeof date === 'number' ? new Date(date) : date;
  const today = new Date();
  return targetDate.toDateString() === today.toDateString();
};

export const isYesterday = (date: Date | string | number): boolean => {
  const targetDate = typeof date === 'string' ? new Date(date) : 
                     typeof date === 'number' ? new Date(date) : date;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return targetDate.toDateString() === yesterday.toDateString();
};

export const isThisWeek = (date: Date | string | number): boolean => {
  const targetDate = typeof date === 'string' ? new Date(date) : 
                     typeof date === 'number' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - targetDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays < 7 && diffDays >= 0;
};