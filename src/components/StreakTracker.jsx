import React from 'react';
import { Flame, CheckCircle, Award, Calendar, Zap, AlertCircle } from 'lucide-react';
import { getFormattedDate } from '../utils/storage';

export default function StreakTracker({ streakData, onCheckIn }) {
  const todayStr = getFormattedDate();
  const checkedInToday = streakData.lastCheckInDate === todayStr;

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
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl bg-gradient-to-r from-slate-900 via-slate-900 to-orange-950/40">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-6 text-center md:text-left">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-400 p-0.5 shadow-lg shadow-orange-500/30 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center">
                  <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
                  <span className="text-xl sm:text-2xl font-extrabold text-white">
                    {streakData.currentStreak}
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                Streak
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {streakData.currentStreak > 0
                  ? `${streakData.currentStreak} Day Workout Streak! 🔥`
                  : 'Start Your Workout Streak Today! 💪'}
              </h2>
              <p className="mt-1 text-sm text-slate-400 max-w-md">
                {checkedInToday
                  ? "Awesome job! You checked in today and kept your streak alive."
                  : "Watch an exercise video or check in manually to build your streak discipline."}
              </p>
              <div className="mt-2 flex items-center space-x-4 text-xs font-semibold text-slate-400">
                <span>Personal Best: <strong className="text-amber-400">{streakData.longestStreak} Days</strong></span>
                <span>•</span>
                <span>Total Check-ins: <strong className="text-orange-400">{(streakData.history || []).length} Days</strong></span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="w-full md:w-auto">
            <button
              onClick={onCheckIn}
              disabled={checkedInToday}
              className={`w-full md:w-auto px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg ${
                checkedInToday
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default'
                  : 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-slate-950 shadow-orange-500/25 hover:shadow-orange-500/40 transform hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              {checkedInToday ? (
                <>
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                  <span>Checked In Today!</span>
                </>
              ) : (
                <>
                  <Flame className="w-6 h-6 fill-slate-950" />
                  <span>Check In Today</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 14-Day Activity Calendar */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-bold text-white">Recent Activity (Last 14 Days)</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Auto-tracked with video workouts</span>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-14 gap-2">
          {daysCalendar.map((day, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                day.isCompleted
                  ? 'bg-orange-500/20 border-orange-500/40 text-orange-400 shadow-sm shadow-orange-500/10'
                  : day.isToday
                  ? 'bg-slate-800 border-amber-500/50 text-amber-300 ring-2 ring-amber-500/20'
                  : 'bg-slate-950/50 border-slate-800 text-slate-500'
              }`}
            >
              <span className="text-[10px] font-semibold uppercase">{day.dayName}</span>
              <span className="text-base font-bold my-0.5">{day.dayNum}</span>
              {day.isCompleted ? (
                <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-slate-800 my-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Streak Milestones Badges */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
        <div className="flex items-center space-x-2 mb-4">
          <Award className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white">Streak Milestone Badges</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {milestones.map((m, idx) => {
            const Icon = m.icon;
            const isUnlocked = streakData.longestStreak >= m.streak;

            return (
              <div
                key={idx}
                className={`flex items-center space-x-4 p-4 rounded-2xl border transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/30 text-white'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60'
                }`}
              >
                <div
                  className={`p-3 rounded-xl ${
                    isUnlocked ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-200">{m.name}</h4>
                  <p className="text-xs text-slate-400">{m.desc}</p>
                  <span
                    className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isUnlocked
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isUnlocked ? 'Unlocked ✨' : `Reach ${m.streak} Days`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
