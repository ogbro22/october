import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
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
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#f97316', '#38bdf8', '#10b981', '#fbbf24'],
    });

    onMarkWatched(video);
    setCompletedNow(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative z-10 w-full max-w-4xl glass-panel border border-orange-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between p-4 px-6 border-b border-slate-800/80 bg-slate-900/90">
            <div className="flex items-center space-x-2">
              <span className="bg-orange-500/20 text-orange-400 text-xs font-extrabold px-2.5 py-1 rounded-full border border-orange-500/30">
                {video.category}
              </span>
              <h3 className="text-base font-bold text-white truncate max-w-md">
                {video.title}
              </h3>
            </div>

            <div className="flex items-center space-x-2">
              <motion.button
                whileTap={{ scale: 1.2 }}
                onClick={() => onToggleFavorite(video.id)}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer border border-slate-700/50"
              >
                <Heart
                  className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`}
                />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer border border-slate-700/50"
              >
                <X className="w-5 h-5" />
              </motion.button>
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
                <h2 className="text-xl font-black text-white tracking-tight">{video.title}</h2>
                <p className="mt-1 text-sm text-slate-300 font-medium">{video.description}</p>
              </div>

              <motion.button
                whileHover={isWatched || completedNow ? {} : { scale: 1.05, boxShadow: '0 0 25px rgba(249, 115, 22, 0.4)' }}
                whileTap={isWatched || completedNow ? {} : { scale: 0.95 }}
                onClick={handleMarkComplete}
                disabled={isWatched || completedNow}
                className={`w-full sm:w-auto shrink-0 px-6 py-3.5 rounded-2xl font-extrabold text-sm transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl cursor-pointer ${
                  isWatched || completedNow
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default'
                    : 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-slate-950 shadow-orange-500/25'
                }`}
              >
                <CheckCircle className="w-5 h-5 stroke-[2.5]" />
                <span>
                  {isWatched || completedNow
                    ? 'Workout Completed & Streak Updated!'
                    : 'Mark Workout Complete'}
                </span>
              </motion.button>
            </div>

            {/* Stats Badges */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
                  <Clock className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Duration</p>
                  <p className="text-sm font-extrabold text-slate-100">{video.duration} Mins</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/30">
                  <Flame className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Est. Burn</p>
                  <p className="text-sm font-extrabold text-slate-100">{video.calories} kcal</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-sky-500/20 text-sky-400 rounded-2xl border border-sky-500/30">
                  <Tag className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Level</p>
                  <p className="text-sm font-extrabold text-slate-100">{video.difficulty}</p>
                </div>
              </div>
            </div>

            {/* Tags */}
            {video.tags && video.tags.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-400">Tags:</span>
                <div className="flex flex-wrap gap-1.5">
                  {video.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
