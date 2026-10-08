import { INITIAL_VIDEOS } from '../data/videos';

const STORAGE_KEYS = {
  STREAK_DATA: 'fitpulse_streak_data',
  WATCH_HISTORY: 'fitpulse_watch_history',
  FAVORITE_VIDEOS: 'fitpulse_favorite_videos',
  CUSTOM_VIDEOS: 'fitpulse_custom_videos',
  WORKOUT_LOGS: 'fitpulse_workout_logs',
};

// Helper: Format date to YYYY-MM-DD
export const getFormattedDate = (date = new Date()) => {
  const d = new Date(date);
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

// Helper: Check if two YYYY-MM-DD dates are consecutive days
export const isYesterday = (dateStr, relativeToDate = new Date()) => {
  const yesterday = new Date(relativeToDate);
  yesterday.setDate(yesterday.getDate() - 1);
  return getFormattedDate(yesterday) === dateStr;
};

// Initialize or get Streak Data
export const getStreakData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STREAK_DATA);
    if (!raw) {
      const initial = {
        currentStreak: 0,
        longestStreak: 0,
        lastCheckInDate: null,
        history: [], // array of 'YYYY-MM-DD'
      };
      localStorage.setItem(STORAGE_KEYS.STREAK_DATA, JSON.stringify(initial));
      return initial;
    }
    const data = JSON.parse(raw);

    // Evaluate if streak expired (missed yesterday and today)
    const today = getFormattedDate();
    if (data.lastCheckInDate && data.lastCheckInDate !== today && !isYesterday(data.lastCheckInDate)) {
      data.currentStreak = 0; // streak broke
      localStorage.setItem(STORAGE_KEYS.STREAK_DATA, JSON.stringify(data));
    }

    return data;
  } catch (err) {
    console.error('Error reading streak data from storage', err);
    return { currentStreak: 0, longestStreak: 0, lastCheckInDate: null, history: [] };
  }
};

// Perform Daily Check-in
export const performCheckIn = () => {
  const data = getStreakData();
  const today = getFormattedDate();

  if (data.lastCheckInDate === today) {
    return { ...data, alreadyCheckedIn: true }; // Already checked in today
  }

  let newCurrentStreak = 1;
  if (data.lastCheckInDate && isYesterday(data.lastCheckInDate)) {
    newCurrentStreak = data.currentStreak + 1;
  }

  const updated = {
    currentStreak: newCurrentStreak,
    longestStreak: Math.max(data.longestStreak, newCurrentStreak),
    lastCheckInDate: today,
    history: Array.from(new Set([...(data.history || []), today])),
  };

  localStorage.setItem(STORAGE_KEYS.STREAK_DATA, JSON.stringify(updated));
  return { ...updated, checkedInNow: true };
};

// Get all videos (Initial + Custom)
export const getVideos = () => {
  try {
    const rawCustom = localStorage.getItem(STORAGE_KEYS.CUSTOM_VIDEOS);
    const customVideos = rawCustom ? JSON.parse(rawCustom) : [];
    return [...INITIAL_VIDEOS, ...customVideos];
  } catch (err) {
    console.error('Error fetching videos', err);
    return INITIAL_VIDEOS;
  }
};

// Add a Custom User Video
export const addCustomVideo = (video) => {
  try {
    const rawCustom = localStorage.getItem(STORAGE_KEYS.CUSTOM_VIDEOS);
    const customVideos = rawCustom ? JSON.parse(rawCustom) : [];

    // Extract youtube ID if full URL passed
    let youtubeId = video.youtubeId;
    if (youtubeId.includes('youtube.com') || youtubeId.includes('youtu.be')) {
      const match = youtubeId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match && match[1]) {
        youtubeId = match[1];
      }
    }

    const newVid = {
      id: `custom-${Date.now()}`,
      title: video.title || 'Custom Exercise Video',
      description: video.description || 'User added exercise video.',
      category: video.category || 'Fitness',
      duration: parseInt(video.duration, 10) || 15,
      calories: parseInt(video.calories, 10) || 150,
      difficulty: video.difficulty || 'Intermediate',
      youtubeId: youtubeId,
      thumbnail: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
      tags: video.tags ? video.tags.split(',').map((t) => t.trim()) : ['Custom'],
      isCustom: true,
    };

    const updated = [newVid, ...customVideos];
    localStorage.setItem(STORAGE_KEYS.CUSTOM_VIDEOS, JSON.stringify(updated));
    return newVid;
  } catch (err) {
    console.error('Error adding custom video', err);
    return null;
  }
};

// Favorites handling
export const getFavorites = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITE_VIDEOS);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
};

export const toggleFavorite = (videoId) => {
  const favorites = getFavorites();
  const index = favorites.indexOf(videoId);
  let updated;
  if (index > -1) {
    updated = favorites.filter((id) => id !== videoId);
  } else {
    updated = [...favorites, videoId];
  }
  localStorage.setItem(STORAGE_KEYS.FAVORITE_VIDEOS, JSON.stringify(updated));
  return updated;
};

// Watch History handling
export const getWatchHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WATCH_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
};

export const markVideoAsWatched = (video) => {
  const history = getWatchHistory();
  const today = getFormattedDate();

  const watchEntry = {
    id: `watch-${Date.now()}`,
    videoId: video.id,
    title: video.title,
    category: video.category,
    duration: video.duration,
    calories: video.calories,
    completedAt: new Date().toISOString(),
    date: today,
  };

  const updatedHistory = [watchEntry, ...history];
  localStorage.setItem(STORAGE_KEYS.WATCH_HISTORY, JSON.stringify(updatedHistory));

  // Automatically trigger check-in on video completion
  performCheckIn();

  // Also log into workout log
  addWorkoutLog({
    title: video.title,
    category: video.category,
    duration: video.duration,
    calories: video.calories,
    type: 'Video Workout',
    date: today,
  });

  return watchEntry;
};

// Workout Logs handling
export const getWorkoutLogs = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WORKOUT_LOGS);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
};

export const addWorkoutLog = (workout) => {
  const logs = getWorkoutLogs();
  const newLog = {
    id: `log-${Date.now()}`,
    title: workout.title || 'Workout Session',
    category: workout.category || 'General',
    duration: parseInt(workout.duration, 10) || 20,
    calories: parseInt(workout.calories, 10) || 150,
    type: workout.type || 'Manual Workout',
    notes: workout.notes || '',
    date: workout.date || getFormattedDate(),
    timestamp: new Date().toISOString(),
  };

  const updated = [newLog, ...logs];
  localStorage.setItem(STORAGE_KEYS.WORKOUT_LOGS, JSON.stringify(updated));

  // Checking in daily streak
  performCheckIn();

  return newLog;
};

// Overall user statistics calculation
export const getOverallStats = () => {
  const streak = getStreakData();
  const logs = getWorkoutLogs();
  const history = getWatchHistory();

  const totalWorkouts = logs.length;
  const totalMinutes = logs.reduce((sum, item) => sum + (parseInt(item.duration, 10) || 0), 0);
  const totalCalories = logs.reduce((sum, item) => sum + (parseInt(item.calories, 10) || 0), 0);
  const watchedVideosCount = new Set(history.map((h) => h.videoId)).size;

  return {
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    totalWorkouts,
    totalMinutes,
    totalCalories,
    watchedVideosCount,
  };
};
