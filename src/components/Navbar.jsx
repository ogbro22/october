import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Tv, Dumbbell, Trophy, PlusCircle } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenAddVideo }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Flame },
    { id: 'videos', label: 'Video Workouts', icon: Tv },
    { id: 'logs', label: 'Workout Log', icon: Dumbbell },
    { id: 'achievements', label: 'Streaks & Badges', icon: Trophy },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-40 border-b border-slate-800/80 glass-panel shadow-2xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Name */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 opacity-70 blur-sm group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-slate-900 border border-orange-500/40 p-2.5 rounded-xl text-white shadow-lg">
                <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-gradient-fire drop-shadow-sm">
                FitPulse
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800/80 text-orange-400/90 border border-orange-500/20">
                PRO GYM
              </span>
            </div>
          </motion.div>

          {/* Nav Tabs with Animated Pill */}
          <nav className="flex space-x-1 sm:space-x-2 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-200 z-10 ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg glow-orange-sm z-0"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-4 h-4 z-10 transition-transform ${isActive ? 'scale-110 text-white' : 'text-slate-400'}`} />
                  <span className="hidden md:inline z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Action Button */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(249, 115, 22, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenAddVideo}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-slate-950 font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Add Video</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
