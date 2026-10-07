import React, { useState } from 'react';
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
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Dumbbell className="w-6 h-6 text-orange-400" />
            <h2 className="text-2xl font-extrabold text-white">Workout Session History</h2>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Automatically logs video workouts & allows manual logging for gym session tracking.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold text-sm px-5 py-3 rounded-2xl shadow-lg shadow-orange-500/20 transition-all shrink-0"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Log Gym Session</span>
        </button>
      </div>

      {/* Logs Table / Card List */}
      {workoutLogs.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center text-slate-500">
            <Dumbbell className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No workouts recorded yet</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            Complete a video workout or manually log your gym session to start building your workout history!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {workoutLogs.map((log) => (
            <div
              key={log.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`p-3 rounded-xl shrink-0 ${
                    log.type === 'Video Workout'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-orange-500/10 text-orange-400'
                  }`}
                >
                  <Dumbbell className="w-6 h-6" />
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-orange-400 px-2 py-0.5 bg-orange-500/10 rounded-full border border-orange-500/20">
                      {log.category}
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400 font-medium">{log.type}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{log.title}</h3>
                  {log.notes && (
                    <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
                      <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{log.notes}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-6 text-xs text-slate-300 font-semibold w-full sm:w-auto justify-between border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
                <div className="flex items-center space-x-1.5 text-amber-400">
                  <Clock className="w-4 h-4" />
                  <span>{log.duration} mins</span>
                </div>
                <div className="flex items-center space-x-1.5 text-rose-400">
                  <Flame className="w-4 h-4" />
                  <span>{log.calories} kcal</span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-400">
                  <Calendar className="w-4 h-4" />
                  <span>{log.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Manual Gym Session Log */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Dumbbell className="w-5 h-5 text-orange-400" />
                <span>Manual Workout Log</span>
              </h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Workout Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chest & Triceps Blast / Morning Run"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Strength">Strength</option>
                    <option value="Cardio">Cardio</option>
                    <option value="HIIT">HIIT</option>
                    <option value="Abs">Abs</option>
                    <option value="Yoga">Yoga</option>
                    <option value="Cycling">Cycling</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Est. Calories Burned
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Session Notes (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Bench press 4x10 @ 185lbs, felt great!"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20"
                >
                  Save Workout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
