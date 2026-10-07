import React, { useState } from 'react';
import { X, Plus, Play, Flame, Trophy, Tv, Dumbbell } from 'lucide-react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import StreakTracker from './components/StreakTracker';
import VideoLibrary from './components/VideoLibrary';
import VideoModal from './components/VideoModal';
import WorkoutLog from './components/WorkoutLog';
import {
  getStreakData,
  performCheckIn,
  getVideos,
  addCustomVideo,
  getFavorites,
  toggleFavorite,
  getWatchHistory,
  markVideoAsWatched,
  getWorkoutLogs,
  addWorkoutLog,
  getOverallStats,
} from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Storage State
  const [streakData, setStreakData] = useState(getStreakData());
  const [videos, setVideos] = useState(getVideos());
  const [favorites, setFavorites] = useState(getFavorites());
  const [watchHistory, setWatchHistory] = useState(getWatchHistory());
  const [workoutLogs, setWorkoutLogs] = useState(getWorkoutLogs());

  // Modal States
  const [activeVideo, setActiveVideo] = useState(null);
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);

  // New Custom Video Form State
  const [newVideoForm, setNewVideoForm] = useState({
    title: '',
    description: '',
    category: 'HIIT',
    duration: 20,
    calories: 180,
    difficulty: 'Intermediate',
    youtubeId: '',
    tags: 'Full Body, Fitness',
  });

  // Handlers
  const handleCheckIn = () => {
    const updated = performCheckIn();
    setStreakData(getStreakData());
    setWorkoutLogs(getWorkoutLogs());
  };

  const handleToggleFavorite = (videoId) => {
    const updatedFavs = toggleFavorite(videoId);
    setFavorites(updatedFavs);
  };

  const handleMarkWatched = (video) => {
    markVideoAsWatched(video);
    setWatchHistory(getWatchHistory());
    setStreakData(getStreakData());
    setWorkoutLogs(getWorkoutLogs());
  };

  const handleAddCustomVideo = (e) => {
    e.preventDefault();
    if (!newVideoForm.title || !newVideoForm.youtubeId) return;

    const added = addCustomVideo(newVideoForm);
    if (added) {
      setVideos(getVideos());
      setShowAddVideoModal(false);
      setNewVideoForm({
        title: '',
        description: '',
        category: 'HIIT',
        duration: 20,
        calories: 180,
        difficulty: 'Intermediate',
        youtubeId: '',
        tags: 'Full Body, Fitness',
      });
    }
  };

  const handleAddManualLog = (workout) => {
    addWorkoutLog(workout);
    setWorkoutLogs(getWorkoutLogs());
    setStreakData(getStreakData());
  };

  const stats = getOverallStats();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddVideo={() => setShowAddVideoModal(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Tab Content Routing */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Quick Greeting */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-orange-950/30 p-6 rounded-3xl border border-slate-800 shadow-xl">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Welcome to FitPulse Gym 👋
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Track your daily workout streak, watch exercise videos, and reach your fitness goals.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setActiveTab('videos')}
                  className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-md shadow-orange-500/20"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Explore Workouts</span>
                </button>
              </div>
            </div>

            {/* Overall Statistics */}
            <StatsOverview stats={stats} />

            {/* Daily Streak Tracker */}
            <StreakTracker streakData={streakData} onCheckIn={handleCheckIn} />

            {/* Featured Videos Showcase */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Tv className="w-5 h-5 text-orange-400" />
                  <h2 className="text-xl font-bold text-white">Recommended Workouts</h2>
                </div>
                <button
                  onClick={() => setActiveTab('videos')}
                  className="text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors"
                >
                  View All Videos ({videos.length}) →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.slice(0, 3).map((video) => (
                  <div
                    key={video.id}
                    onClick={() => setActiveVideo(video)}
                    className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:border-orange-500/40 transition-all shadow-lg hover:-translate-y-1"
                  >
                    <div className="relative aspect-video overflow-hidden bg-slate-950">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-slate-950">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute top-2.5 left-2.5 bg-slate-950/80 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-orange-500/20">
                        {video.category}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-sm text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                        {video.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">{video.duration} Mins • {video.calories} kcal</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="animate-fadeIn">
            <VideoLibrary
              videos={videos}
              favorites={favorites}
              watchHistory={watchHistory}
              onPlayVideo={(video) => setActiveVideo(video)}
              onToggleFavorite={handleToggleFavorite}
              onOpenAddVideo={() => setShowAddVideoModal(true)}
            />
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="animate-fadeIn">
            <WorkoutLog workoutLogs={workoutLogs} onAddLog={handleAddManualLog} />
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="animate-fadeIn space-y-6">
            <StreakTracker streakData={streakData} onCheckIn={handleCheckIn} />
          </div>
        )}
      </main>

      {/* Video Player Modal */}
      {activeVideo && (
        <VideoModal
          video={activeVideo}
          onClose={() => setActiveVideo(null)}
          onMarkWatched={handleMarkWatched}
          isFavorite={favorites.includes(activeVideo.id)}
          onToggleFavorite={handleToggleFavorite}
          isWatched={watchHistory.some((h) => h.videoId === activeVideo.id)}
        />
      )}

      {/* Modal for Adding Custom YouTube Video */}
      {showAddVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Plus className="w-5 h-5 text-orange-400" />
                <span>Add Custom Exercise Video</span>
              </h3>
              <button
                onClick={() => setShowAddVideoModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomVideo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Video Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 20 Min Calisthenics Full Body"
                  value={newVideoForm.title}
                  onChange={(e) => setNewVideoForm({ ...newVideoForm, title: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  YouTube Link or Video ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. https://www.youtube.com/watch?v=ml6cT4AZdqI"
                  value={newVideoForm.youtubeId}
                  onChange={(e) => setNewVideoForm({ ...newVideoForm, youtubeId: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={newVideoForm.category}
                    onChange={(e) => setNewVideoForm({ ...newVideoForm, category: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-orange-500"
                  >
                    <option value="HIIT">HIIT</option>
                    <option value="Strength">Strength</option>
                    <option value="Abs">Abs</option>
                    <option value="Yoga">Yoga</option>
                    <option value="Cardio">Cardio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={newVideoForm.difficulty}
                    onChange={(e) => setNewVideoForm({ ...newVideoForm, difficulty: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newVideoForm.duration}
                    onChange={(e) => setNewVideoForm({ ...newVideoForm, duration: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Est. Burn (Calories)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newVideoForm.calories}
                    onChange={(e) => setNewVideoForm({ ...newVideoForm, calories: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  placeholder="Short description of the workout routine..."
                  value={newVideoForm.description}
                  onChange={(e) => setNewVideoForm({ ...newVideoForm, description: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddVideoModal(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20"
                >
                  Add Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/50 py-6 text-center text-xs text-slate-500">
        <p>FitPulse Gym App • Track your daily streaks, exercise videos, & fitness history.</p>
      </footer>
    </div>
  );
}
