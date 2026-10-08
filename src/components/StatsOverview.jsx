import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Clock, Flame as FireIcon, Dumbbell } from 'lucide-react';

export default function StatsOverview({ stats }) {
  const cards = [
    {
      title: 'Current Streak',
      value: `${stats.currentStreak} Days`,
      subtitle: `Best: ${stats.longestStreak} days`,
      icon: Flame,
      gradient: 'from-orange-500/20 via-amber-500/10 to-transparent',
      borderColor: 'border-orange-500/30 hover:border-orange-500/60',
      iconBg: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
      glowColor: 'group-hover:shadow-orange-500/20',
    },
    {
      title: 'Total Exercise',
      value: `${stats.totalMinutes} Mins`,
      subtitle: `${(stats.totalMinutes / 60).toFixed(1)} Hours logged`,
      icon: Clock,
      gradient: 'from-sky-500/20 via-blue-500/10 to-transparent',
      borderColor: 'border-sky-500/30 hover:border-sky-500/60',
      iconBg: 'bg-sky-500/20 text-sky-400 border border-sky-500/30',
      glowColor: 'group-hover:shadow-sky-500/20',
    },
    {
      title: 'Calories Burned',
      value: `${stats.totalCalories.toLocaleString()} kcal`,
      subtitle: 'Estimated energy spent',
      icon: FireIcon,
      gradient: 'from-rose-500/20 via-red-500/10 to-transparent',
      borderColor: 'border-rose-500/30 hover:border-rose-500/60',
      iconBg: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
      glowColor: 'group-hover:shadow-rose-500/20',
    },
    {
      title: 'Workouts Done',
      value: `${stats.totalWorkouts}`,
      subtitle: `${stats.watchedVideosCount} videos watched`,
      icon: Dumbbell,
      gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      borderColor: 'border-emerald-500/30 hover:border-emerald-500/60',
      iconBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      glowColor: 'group-hover:shadow-emerald-500/20',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`group relative overflow-hidden rounded-2xl glass-panel border ${card.borderColor} p-5 shadow-xl transition-all duration-300 bg-gradient-to-br ${card.gradient}`}
          >
            {/* Background Ambient Glow */}
            <div className={`absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-gradient-to-br ${card.gradient} blur-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-500`} />

            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {card.title}
                </p>
                <h3 className="mt-1.5 text-2xl font-black text-white tracking-tight drop-shadow-sm">
                  {card.value}
                </h3>
                <p className="mt-1 text-xs text-slate-400 font-medium">
                  {card.subtitle}
                </p>
              </div>
              <motion.div
                whileHover={{ rotate: 12, scale: 1.1 }}
                className={`p-3 rounded-2xl ${card.iconBg} shadow-lg transition-transform`}
              >
                <Icon className="w-6 h-6 stroke-[2.2]" />
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
