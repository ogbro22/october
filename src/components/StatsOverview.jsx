import React from 'react';
import { Flame, Clock, Flame as FireIcon, Dumbbell, PlayCircle } from 'lucide-react';

export default function StatsOverview({ stats }) {
  const cards = [
    {
      title: 'Current Streak',
      value: `${stats.currentStreak} Days`,
      subtitle: `Best: ${stats.longestStreak} days`,
      icon: Flame,
      color: 'from-orange-500/20 to-amber-500/10',
      borderColor: 'border-orange-500/30',
      iconBg: 'bg-orange-500/20 text-orange-400',
    },
    {
      title: 'Total Watch & Exercise',
      value: `${stats.totalMinutes} Mins`,
      subtitle: `${(stats.totalMinutes / 60).toFixed(1)} Hours logged`,
      icon: Clock,
      color: 'from-blue-500/20 to-cyan-500/10',
      borderColor: 'border-blue-500/30',
      iconBg: 'bg-blue-500/20 text-blue-400',
    },
    {
      title: 'Calories Burned',
      value: `${stats.totalCalories.toLocaleString()} kcal`,
      subtitle: 'Estimated energy spent',
      icon: FireIcon,
      color: 'from-red-500/20 to-pink-500/10',
      borderColor: 'border-red-500/30',
      iconBg: 'bg-red-500/20 text-red-400',
    },
    {
      title: 'Workouts Completed',
      value: `${stats.totalWorkouts}`,
      subtitle: `${stats.watchedVideosCount} videos watched`,
      icon: Dumbbell,
      color: 'from-emerald-500/20 to-teal-500/10',
      borderColor: 'border-emerald-500/30',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-2xl bg-slate-900 border ${card.borderColor} p-5 shadow-lg backdrop-blur-md bg-gradient-to-br ${card.color} transition-all hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {card.title}
                </p>
                <h3 className="mt-1 text-2xl font-bold text-white tracking-tight">
                  {card.value}
                </h3>
                <p className="mt-1 text-xs text-slate-400 font-medium">
                  {card.subtitle}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${card.iconBg} shadow-inner`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
