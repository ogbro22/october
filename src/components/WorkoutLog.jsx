import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Dumbbell, Plus, Clock, Flame, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { getFormattedDate } from '../utils/storage';

export default function WorkoutLog({ workoutLogs, onAddLog }) {
  const [showLogModal, setShowLogModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Strength',
    duration: 30,
    calories: 200,
    notes: '',
    date: getFormattedDate(),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f97316', '#eab308', '#38bdf8'],
    });

    onAddLog(formData);
    setShowLogModal(false);
    setFormData({
      title: '',
      category: 'Strength',
      duration: 30,
      calories: 200,
      notes: '',
      date: getFormattedDate(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Log Action */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel border border-slate-800/80 rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center space-x-2">
            <Dumbbell className="w-6 h-6 text-orange-400 stroke-[2.5]" />
            <h2 className="text-2xl font-black text-white tracking-tight">Workout Session History</h2>
          </div>
          <p className="mt-1 text-sm text-slate-300 font-medium">
            Automatically logs video workouts & allows manual logging for gym session tracking.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(249, 115, 22, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowLogModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-extrabold text-sm px-5 py-3 rounded-2xl shadow-lg shadow-orange-500/20 cursor-pointer shrink-0"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Log Gym Session</span>
        </motion.button>
      </motion.div>

      {/* Logs Table / Card List */}
      {workoutLogs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel border border-slate-800/80 rounded-3xl p-12 text-center space-y-3"
        >
          <div className="w-12 h-12 bg-slate-800/80 rounded-2xl mx-auto flex items-center justify-center text-slate-400">
            <Dumbbell className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No workouts recorded yet</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto font-medium">
            Complete a video workout or manually log your gym session to start building your workout history!
          </p>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="space-y-3"
        >
          <AnimatePresence>
            {workoutLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -2 }}
                className="glass-card border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-3 rounded-2xl shrink-0 border ${
                      log.type === 'Video Workout'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                    }`}
                  >
                    <Dumbbell className="w-6 h-6 stroke-[2.2]" />
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-extrabold text-orange-400 px-2.5 py-0.5 bg-orange-500/15 rounded-full border border-orange-500/30">
                        {log.category}
                      </span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs text-slate-400 font-bold">{log.type}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1.5 tracking-tight">{log.title}</h3>
                    {log.notes && (
                      <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1.5 font-medium">
                        <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{log.notes}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-xs text-slate-300 font-bold w-full sm:w-auto justify-between border-t sm:border-t-0 border-slate-800/80 pt-3 sm:pt-0">
                  <div className="flex items-center space-x-1.5 text-amber-400">
                    <Clock className="w-4 h-4 stroke-[2.2]" />
                    <span>{log.duration} Mins</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-rose-400">
                    <Flame className="w-4 h-4 stroke-[2.2]" />
                    <span>{log.calories} kcal</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <Calendar className="w-4 h-4 stroke-[2.2]" />
                    <span>{log.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modal for Manual Gym Session Log */}
      <AnimatePresence>
        {showLogModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogModal(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="relative z-10 w-full max-w-lg glass-panel border border-orange-500/30 rounded-3xl p-6 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <h3 className="text-lg font-black text-white flex items-center space-x-2">
                  <Dumbbell className="w-5 h-5 text-orange-400 stroke-[2.5]" />
                  <span>Manual Workout Log</span>
                </h3>
                <button
                  onClick={() => setShowLogModal(false)}
                  className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Workout Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chest & Triceps Blast / Morning Run"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full glass-input text-slate-100 text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full glass-input text-slate-100 text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-orange-500 font-medium"
                    >
                      <option value="Strength" className="bg-slate-900">Strength</option>
                      <option value="Cardio" className="bg-slate-900">Cardio</option>
                      <option value="HIIT" className="bg-slate-900">HIIT</option>
                      <option value="Abs" className="bg-slate-900">Abs</option>
                      <option value="Yoga" className="bg-slate-900">Yoga</option>
                      <option value="Cycling" className="bg-slate-900">Cycling</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full glass-input text-slate-100 text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-orange-500 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full glass-input text-slate-100 text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-orange-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                      Est. Calories Burned
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={formData.calories}
                      onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                      className="w-full glass-input text-slate-100 text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-orange-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Session Notes (Optional)
                  </label>
                  <textarea
                    rows="2"
                    placeholder="e.g. Bench press 4x10 @ 185lbs, felt great!"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full glass-input text-slate-100 text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setShowLogModal(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md shadow-orange-500/20 cursor-pointer"
                  >
                    Save Workout
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
