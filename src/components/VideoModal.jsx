import React, { useState } from 'react';
import { X, CheckCircle, Clock, Flame, Tag, Heart } from 'lucide-react';

export default function VideoModal({
  video,
  onClose,
  onMarkWatched,
  isFavorite,
  onToggleFavorite,
  isWatched,
}) {
  const [completedNow, setCompletedNow] = useState(false);

  if (!video) return null;

  const handleMarkComplete = () => {
    onMarkWatched(video);
    setCompletedNow(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-2">
            <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-2.5 py-1 rounded-full border border-orange-500/30">
              {video.category}
            </span>
            <h3 className="text-base font-bold text-white truncate max-w-md">
              {video.title}
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleFavorite(video.id)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`}
              />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Embedded Video Area */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Video Info & Mark Complete Action */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-white">{video.title}</h2>
              <p className="mt-1 text-sm text-slate-400">{video.description}</p>
            </div>

            <button
              onClick={handleMarkComplete}
              disabled={isWatched || completedNow}
              className={`w-full sm:w-auto shrink-0 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg ${
                isWatched || completedNow
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 shadow-orange-500/20'
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              <span>
                {isWatched || completedNow
                  ? 'Workout Completed & Streak Updated!'
                  : 'Mark Workout Complete'}
              </span>
            </button>
          </div>

          {/* Stats Badges */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500">Duration</p>
                <p className="text-sm font-bold text-slate-200">{video.duration} Minutes</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500">Est. Burn</p>
                <p className="text-sm font-bold text-slate-200">{video.calories} Calories</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500">Level</p>
                <p className="text-sm font-bold text-slate-200">{video.difficulty}</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {video.tags && video.tags.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-500">Tags:</span>
              <div className="flex flex-wrap gap-1.5">
                {video.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
