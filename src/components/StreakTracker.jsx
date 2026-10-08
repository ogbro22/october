import React from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Flame, CheckCircle, Award, Calendar, Zap } from 'lucide-react';
import { getFormattedDate } from '../utils/storage';

export default function StreakTracker({ streakData, onCheckIn }) {
  const todayStr = getFormattedDate();
  const checkedInToday = streakData.lastCheckInDate === todayStr;

  const handleCheckInClick = (e) => {
    if (checkedInToday) return;

    // Trigger celebratory confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f97316', '#fbbf24', '#ef4444', '#10b981'],
    });

    onCheckIn();
  };

  // Generate last 14 days calendar
  const generatePastDays = (numDays = 14) => {
    const days = [];
    const today = new Date();

    for (let i = numDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const formatted = getFormattedDate(d);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const isCompleted = (streakData.history || []).includes(formatted);
      const isToday = formatted === todayStr;

      days.push({
        date: formatted,
        dayName,
        dayNum,
        isCompleted,
        isToday,
      });
    }
    return days;
  };

  const daysCalendar = generatePastDays(14);

  // Milestone Badges definitions
  const milestones = [
    { name: 'First Step', streak: 1, desc: 'Logged 1st workout', icon: Zap },
    { name: '3-Day Blaze', streak: 3, desc: '3 consecutive days', icon: Flame },
    { name: 'Week Warrior', streak: 7, desc: '7 consecutive days', icon: Award },
    { name: 'Consistency Master', streak: 14, desc: '14 consecutive days', icon: CheckCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Main Streak Banner & Daily Check-in */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl glass-panel border border-orange-500/30 p-6 sm:p-8 shadow-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-orange-950/40"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-6 text-center md:text-left">
            <motion.div
              whileHover={{ scale: 1.08, rotate: [0, -5, 5, 0] }}
              className="relative cursor-pointer"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 p-0.5 shadow-xl shadow-orange-500/30 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center">
                  <Flame className="w-8 h-8 text-orange-500 animate-bounce" />
                  <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {streakData.currentStreak}
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-lg">
                STREAK
              </div>
            </motion.div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {streakData.currentStreak > 0
                  ? `${streakData.currentStreak} Day Workout Streak! 🔥`
                  : 'Start Your Workout Streak Today! 💪'}
              </h2>
              <p className="mt-1 text-sm text-slate-300 max-w-md font-medium">
                {checkedInToday
                  ? "Awesome job! You checked in today and kept your streak alive."
                  : "Watch an exercise video or check in manually to build your streak discipline."}
              </p>
              <div className="mt-3 flex items-center space-x-4 text-xs font-bold text-slate-400">
                <span>Personal Best: <strong className="text-amber-400 font-extrabold">{streakData.longestStreak} Days</strong></span>
                <span>•</span>
                <span>Total Check-ins: <strong className="text-orange-400 font-extrabold">{(streakData.history || []).length} Days</strong></span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="w-full md:w-auto">
            <motion.button
              whileHover={checkedInToday ? {} : { scale: 1.05, boxShadow: '0 0 25px rgba(249, 115, 22, 0.5)' }}
              whileTap={checkedInToday ? {} : { scale: 0.95 }}
              onClick={handleCheckInClick}
              disabled={checkedInToday}
              className={`w-full md:w-auto px-8 py-4 rounded-2xl font-extrabold text-base transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl cursor-pointer ${
                checkedInToday
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 cursor-default'
                  : 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-slate-950 shadow-orange-500/30'
              }`}
            >
              {checkedInToday ? (
                <>
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                  <span>Checked In Today!</span>
                </>
              ) : (
                <>
                  <Flame className="w-6 h-6 fill-slate-950 text-slate-950" />
                  <span>Check In Today</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* 14-Day Activity Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-3xl glass-panel border border-slate-800 p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-extrabold text-white">Recent Activity (Last 14 Days)</h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold">Auto-tracked with video workouts</span>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-14 gap-2">
          {daysCalendar.map((day, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.1, y: -2 }}
              className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all ${
                day.isCompleted
                  ? 'bg-orange-500/20 border-orange-500/50 text-orange-400 shadow-md shadow-orange-500/10'
                  : day.isToday
                  ? 'bg-slate-800 border-amber-500/60 text-amber-300 ring-2 ring-amber-500/20'
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-500'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider">{day.dayName}</span>
              <span className="text-base font-black my-0.5">{day.dayNum}</span>
              {day.isCompleted ? (
                <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-slate-800 my-1" />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Streak Milestones Badges */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-3xl glass-panel border border-slate-800 p-6 shadow-xl"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Award className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-extrabold text-white">Streak Milestone Badges</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {milestones.map((m, idx) => {
            const Icon = m.icon;
            const isUnlocked = streakData.longestStreak >= m.streak;

            return (
              <motion.div
                key={idx}
                whileHover={{ y: -3 }}
                className={`flex items-center space-x-4 p-4 rounded-2xl border transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent border-amber-500/40 text-white shadow-lg shadow-amber-500/10'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-500 opacity-60'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl ${
                    isUnlocked ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-100">{m.name}</h4>
                  <p className="text-xs text-slate-400">{m.desc}</p>
                  <span
                    className={`inline-block mt-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isUnlocked
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isUnlocked ? 'Unlocked ✨' : `Reach ${m.streak} Days`}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
